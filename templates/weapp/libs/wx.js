wx.navigateBackSafe = function navigateBackSafe() {
  wx.navigateBackSafe({});
};

wx.navigateToSafe = function navigateBackSafe({ url, success, complete } = {}) {
  wx.navigateTo({
    url,
    success,
    complete,
    fail: () => {
      wx.switchTab({
        url,
      });
    },
  });
};
