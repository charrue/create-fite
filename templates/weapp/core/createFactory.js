import { useComputedMixin, useGlobalMixin, useStoreMixin } from "./mixins/builtIn";

const PAGE_HOOKS = [
  "onLoad",
  "onReady",
  "onShow",
  "onHide",
  "onUnload",
  "onPullDownRefresh",
  "onReachBottom",
  "onShareAppMessage",
  "onPageScroll",
  "onTitleClick",
  "onOptionMenuClick",
  "onUpdated",
  "onBeforeCreate",
];

const defaultOptions = {
  methods: {},
};

export const createFactory = (type) => (opts = {}) => {
  const options = { ...defaultOptions, ...opts };
  useComputedMixin(options);
  useStoreMixin(options);
  if (type === "page") {
    useGlobalMixin(options);
    // Component中如果要使用Page的生命周期方法，需要放置在methods中
    Object.keys(options).forEach((key) => {
      if (PAGE_HOOKS.includes(key) && typeof options[key] === "function") {
        options.methods[key] = options[key];
        delete options[key];
      }
    });
  }

  return Component(options);
};
export const createComponent = createFactory("component");

export const createPage = createFactory("page");
