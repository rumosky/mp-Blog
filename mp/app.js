// app.js
App({
  onLaunch() {
    // 获取当前年份
    const date = new Date();
    const currentYear = date.getFullYear();
    this.globalData.currentYear = currentYear;
  },

  globalData: {
    baseURL: "https://rumosky.com/api",
    currentYear: null,
  },
});
