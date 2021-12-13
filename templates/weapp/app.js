const { injectGlobalMixin } = require("./core/mixins/builtIn");

injectGlobalMixin("share", {
  onShareAppMessage() {
    return {};
  },
});

App({
  globalData: {
    menuBtnInfo: {},
  },
});
