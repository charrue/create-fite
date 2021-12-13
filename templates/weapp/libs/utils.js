import dayjs from "dayjs";
import qs from "qs";

/**
 * 创建一个从 object 中选中一些的属性的对象
 * @param { Array } data 来源对象
 * @param { Array } attrs 选出的属性
 */
export function pick(data, attrs = []) {
  const result = {};
  attrs.forEach((attr) => {
    if (typeof data[attr] !== "undefined") {
      result[attr] = data[attr];
    }
  });
  return result;
}

export const hasOwnProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

export const formatTime = (date, showHour = false) => dayjs(date).format(`YYYY-MM-DD${showHour ? " HH:mm:ss" : ""}`);

export const parseParams = (str) => qs.parse(str);

const camelizeRE = /-(\w)/g;
export const camelize = (str) => str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ""));

const hyphenateRE = /\B([A-Z])/g;
export const hyphenate = (str) => str.replace(hyphenateRE, "-$1").toLowerCase();

export const getCurrentRoute = () => {
  try {
    const pages = getCurrentPages();

    const currentPage = pages[pages.length - 1];
    return `/${currentPage.route}`;
  } catch (e) {
    return "";
  }
};

/**
*
* @param fn {Function}   实际要执行的函数，函数不能使用箭头函数，否则会丢失作用域
* @param delay {Number}  执行间隔，单位是毫秒（ms）
*
* @return {Function}     返回一个“节流”函数
*/
export function throttle(fn, threshhold = 250) {
  // 记录上次执行的时间
  let last = null;

  // 定时器
  let timer = null;

  // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
  return function (...args) {
    // 保存函数调用时的上下文和参数，传递给 fn
    const context = this;

    const now = +new Date();

    // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
    // 执行 fn，并重新计时
    if (last && now < last + threshhold) {
      clearTimeout(timer);

      // 保证在当前时间区间结束后，再执行一次 fn
      timer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, threshhold);

    // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
