const { loginAuth } = require("../../../libs/login-auth");

Page({
  prevUrl: "",
  onLoad() {
    const pages = getCurrentPages();
    console.log(pages);
    if (pages.length >= 2) {
      this.prevUrl = pages[pages.length - 2].route;
    }
  },
  async handlePhoneNumber(e) {
    const bindPhoneResult = await loginAuth.bindPhone(e.detail);
    if (!bindPhoneResult) {
      return;
    }

    // 等待1100ms,等toast隐藏后返回上一页
    await new Promise((resolve) => { setTimeout(() => resolve(), 1100); });
    wx.navigateBack({
      fail() {
        wx.switchTab({
          url: "/pages/tabbar/home/home",
        });
      },
    });
  },
});
