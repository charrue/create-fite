/* eslint-disable no-param-reassign */
const computedBehavior = require("miniprogram-computed").behavior;
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { camelize } from "../../libs/utils";
import { store } from "../../store/index";

export const useComputedMixin = (options) => {
  options.behaviors = options.behaviors || [];
  options.behaviors.push(computedBehavior);
  return options;
};

export const useStoreMixin = (options) => {
  options.behaviors = options.behaviors || [];
  if (options.storeBindings) {
    options.storeBindings = { store, ...options.storeBindings };
    options.behaviors.push(storeBindingsBehavior);
  }
  return options;
};

const globalMixins = {};
export const injectGlobalMixin = (name, mixin) => {
  globalMixins[name] = mixin;
};

/**
 * 不推荐使用mixin，不论是全局的还是局部的，因为滥用mixin会导致页面中的变量不知道是哪个mixin中的
 * 此方法适用于把大部分的页面设置为可分享的(onShareAppMessage)
 * 如果要忽略在全局设置的option，可以在data中设置变量进行忽略，变量格式为`ignore<Name>`
 * 例如全局mixin的name为share，如果某个页面不想将此全局的mixin应用到当前页面，可以在data中声明ignoreShare=true
 */
export const useGlobalMixin = (options) => {
  Object.keys(globalMixins).forEach((k) => {
    if (options.data[camelize(`ignore-${k}`)] !== true) {
      Object.assign(options, globalMixins[k]);
    }
  });
  return options;
};
