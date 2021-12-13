import axios from "axios";
import { getToken, setToken } from "../../libs/business";
import { hasOwnProperty } from "../../libs/utils";
import { logger } from "../../libs/logger";
import { loginAuth } from "../../libs/login-auth";

const { CancelToken } = axios;

const requestWhiteList = ["/login"];

let isRefreshing = false;
let requests = [];

/**
 * 请求拦截器集合
 */
export let requestInterceptors = [];

/**
 * 响应拦截器集合
 */
export let responseInterceptors = [];

const __repeatRequestMap = {};

const repetitiveRequestLimitInterceptor = [
  (config) => {
    config.data = config.data || {};

    /**
     * 如果请求带有repetitiveRequestLimit参数
     * 则会进行防止重复提交的操作
     * 利用axios的CancelToken
     */
    if (hasOwnProperty(config.data, "repetitiveRequestLimit")) {
      const key = `${config.url}&${config.method}&${JSON.stringify(
        config.data,
      )}`;
      config.cancelToken = new CancelToken((c) => {
        if (__repeatRequestMap[key]) {
          if (Date.now() - __repeatRequestMap[key] > 1000) {
            // 超过1s，删除对应的请求记录，可以重新发送请求
            delete __repeatRequestMap[key];
          } else {
            // 1s以内的已发起请求，取消重复请求
            c("repeated");
          }
        }
      });

      __repeatRequestMap[key] = Date.now();
    }

    return config;
  },
  (error) => {
    logger.error(error);
    return Promise.reject(error);
  },
];

const checkTokenInterceptor = [
  (config) => {
    config.data = config.data || {};
    const globalToken = getToken();
    if (!hasOwnProperty(config.data, "token")) {
      // config.headers.Authorization = getToken();
      config.data.token = globalToken;
    }

    console.log(config.url, requests);

    if (!config.data.token && !requestWhiteList.includes(config.url)) {
      if (!isRefreshing) {
        logger.info(`【刷新token】${config.url}接口的token为空`);

        isRefreshing = true;

        loginAuth.wxLogin(true)
          .then((res) => {
            if (res.state == 1) {
              loginAuth.getUserInfo(true);
              isRefreshing = false;
              console.log("用户信息更新成功");
              return res.data.token;
            }
            return undefined;
          })
          .then((token) => {
            const finalToken = token || getToken();
            console.log("finalTOken", finalToken);

            if (!finalToken) return;

            logger.success("token刷新成功");

            setToken(finalToken);
            // 遍历执行需要重新调用的接口
            requests.forEach((cb) => cb(finalToken));
            // 执行完成后，清空队列
            requests = [];
          });
      }
      /**
       * 如果是token为空的接口
       */
      const retryOriginalRequest = new Promise((resolve) => {
        requests.push([
          config,
          (originConfig) => {
            // 在请求参数中加上token
            if (typeof originConfig.data === "string") {
              originConfig.data = {
                ...JSON.parse(originConfig.data || "{}"),
                token: getToken(),
              };
            } else {
              originConfig.data = {
                ...(originConfig.data || {}),
                token: getToken(),
              };
            }

            logger.info(`${config.url}接口的参数为`, originConfig.data);

            // 将请求对象config返回给axios，保证请求链能够执行
            resolve(originConfig);
          },
        ]);
      });
      return retryOriginalRequest;
    }

    if (requests.length > 0 && globalToken) {
      // 遍历执行需要重新调用的接口
      requests.forEach(([originConfig, cb]) => cb(originConfig));
      // 执行完成后，清空队列
      requests = [];
    }

    return config;
  },
  (error) => {
    logger.error(error);
    return Promise.reject(error);
  },
];

const cleanDataInterceptor = [
  (response = {}) => {
    const { data } = response;
    return data;
  },
  (error) => {
    if (axios.isCancel(error)) {
      return new Promise(() => { });
    }
    if (error.message !== "repeated") {
      console.error(`[fetch error]${error}`);
      return Promise.reject(error);
    }
    console.log(
      "%c【请求重复】%c",
      "background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;",
      "background:#f56c6c; padding: 1px; border-radius: 0 3px 3px 0; color: #fff;",
    );
    return {
      state: 3,
      message: "",
      data: {},
    };
  },
];

// axios 请求拦截器 是逆序执行的
requestInterceptors = [repetitiveRequestLimitInterceptor, checkTokenInterceptor];
responseInterceptors = [cleanDataInterceptor];
