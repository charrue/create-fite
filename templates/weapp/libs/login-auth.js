import { logger } from "./logger";
import { wxStorage } from "../core/storage";
import { wxp } from "../core/promisify";
import {
  getToken,
  setToken,
  removeToken,
} from "./business";
import {
  userLogin,
  saveUserPhone,
  getUserDetail,
  saveUserInfo,
} from "../apis/index";
import { ONE_DAY } from "./constants";
import { getCurrentRoute } from "./utils";

export const AuthStep = {
  /* 游客态。静默登录成功，未绑定手机号，无用户信息。需要昵称授权、手机号授权 */
  VISITOR: 1,
  /* 会员态，仅有昵称头像，无手机号。获取到用户的姓名、头像授权。需要手机号授权 */
  NAME_AUTH_ONLY: 2,
  /* 会员信息态。有昵称头像，有手机号，能够获取到用户的信息。无需授权 */
  MEMBER: 3,
};

export const createLoginAuth = () => {
  let loginResponse = {};
  let cachedUserInfo = null;
  return {
    AuthStep,
    getLoginResponse() {
      return loginResponse;
    },
    /**
     * 调用微信登陆
     */
    async wxLogin() {
      const { code, errMsg } = await wx.login();

      if (!code) {
        logger.error(`登录失败: ${errMsg}`);
        return undefined;
      }

      const response = await userLogin({ code });
      loginResponse = response;
      console.log("login response");
      if (response.state == 1 && response.data.token) {
        setToken(response.data.token);
      }
      return response;
    },

    /**
   * @feature
   * 检查用户授权情况
   * @todo
   * TODO 权限的判断有待优化
   */
    getCurrentAuthStep() {
      const token = getToken();
      return this.getUserInfo()
        .then((data) => {
          console.log(data);
          if (token && !data) return AuthStep.VISITOR;
          if (data && !data.nickName) return AuthStep.VISITOR;
          if (data && data.nickName && !data.mobile) return AuthStep.NAME_AUTH_ONLY;

          if (data && data.nickName && data.mobile) return AuthStep.MEMBER;
          return AuthStep.VISITOR;
        })
        .catch(() => AuthStep.VISITOR);
    },

    async checkAuth(auth = AuthStep.MEMBER) {
      const currentStep = await this.getCurrentAuthStep();
      if (currentStep < auth) {
        throw new Error("授权未完成");
      } else {
        return true;
      }
    },

    async continueAuth() {
      const currentStep = await this.getCurrentAuthStep();

      if (currentStep == AuthStep.VISITOR) {
        await this.bindUserInfo();
      } else if (currentStep == AuthStep.NAME_AUTH_ONLY) {
        await this.toPhoneAuthPage();
      }
    },

    /**
   * @feature
   * 获取昵称、头像授权时执行
   * https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html
   */
    async bindUserInfo(redirectToPhoneAuth = true) {
      // if (!getToken()) {
      //   await this.wxLogin();
      // }

      const currentRoute = getCurrentRoute();
      if (!wx.getUserProfile) return;

      const user = wxStorage.get("userInfo");

      if (user && user.nick_name) {
        wx.showToast({
          title: "您已完成昵称授权",
          icon: "none",
        });
        return;
      }

      const {
        errMsg,
        userInfo,
      } = await wxp.getUserProfile({
        desc: "用于完善会员资料",
      });

      if (errMsg !== "getUserProfile:ok") {
        return;
      }
      const { avatarUrl, nickName } = userInfo;
      await saveUserInfo({
        avatar: avatarUrl,
        nick_name: nickName,
      });

      await this.getUserInfo(true);

      if (redirectToPhoneAuth && !cachedUserInfo.mobile) {
        this.toPhoneAuthPage(currentRoute);
      }
    },
    /**
     * 获取手机号授权时执行
     */
    async bindPhone({ errMsg, iv, encryptedData }) {
      if (!getToken()) {
        await this.wxLogin();
      }

      if (errMsg !== "getPhoneNumber:ok") {
        return false;
      }

      const res = await saveUserPhone({
        encryptedData,
        iv,
      });

      wx.showToast({
        title: res.message,
        icon: "none",
        duration: 1000,
      });
      if (res.state == 1) {
        await this.updateUserInfo({
          mobile: res.data.mobile,
        });
        return true;
      }
      return false;
      // await this.login(true);
    },
    toPhoneAuthPage() {
      wx.navigateTo({
        url: `/pages/app/phone-authorize/phone-authorize`,
      });
    },
    async getUserInfo(refresh = false) {
      if (!refresh) {
        const userInfo = wxStorage.get("userInfo");
        if (!userInfo) {
          this.getUserInfo(true);
        }
      }

      const response = await getUserDetail({ repetitiveRequestLimit: 1 });
      if (response.state == 1) {
        cachedUserInfo = response.data;
        wxStorage.set("userInfo", cachedUserInfo, ONE_DAY);
        return cachedUserInfo;
      }
      removeToken();
      return undefined;
    },
  };
};

export const loginAuth = createLoginAuth();
