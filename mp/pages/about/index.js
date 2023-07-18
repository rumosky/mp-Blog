// index.js
// 获取应用实例
const app = getApp();

Page({
  data: {
    currentYear: app.globalData.currentYear,
    pageList: [],
    lastRequestTime: 0, // 最后一次发起请求的时间
    canRequest: true, // 是否可以发起新的请求
  },
  onShareAppMessage: function () {
    // 设置分享的标题、路径和图片
    return {
      title: '如默星空-关于', 
      path: '/pages/about/index',
      // imageUrl: this.data.articleDetail.coverImage, // 设置分享图片，根据你的实际情况修改
    };
  },
  onShareTimeline: function () {
    // 设置分享到朋友圈的标题和路径
    return {
      title: '如默星空-关于',
      query: '',
    };
  },
  // 监听页面滚动事件
  onPageScroll(event) {
    const scrollTop = event.scrollTop;
    this.setData({
      scrollTop: scrollTop
    });
  },
  copyText: function (event) {
    var text = event.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success: function () {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500
        });
      }
    });
  },
  loadPageList() {
    wx.showLoading({
      title: '加载中',
    });
    const that = this;
    const url = app.globalData.baseURL + "/pages";
    // 时间限制判断
    const currentTime = Date.now();
    const timeInterval = 1000; // 设定时间间隔，单位为毫秒
    if (currentTime - this.data.lastRequestTime < timeInterval || !this.data.canRequest) {
      return;
    }
    wx.request({
      url: url,
      method: "GET",
      success: function (res) {
        if (res.statusCode === 200) {
          const data = res.data.data;
          const currentPageList = data.dataSet;
          that.setData({
            pageList: currentPageList,
          });
        } else {
          console.error("请求失败");
        };
        wx.hideLoading();
      },
      fail: function (error) {
        console.error(error);
        wx.hideLoading();
      },
    });
  },
  onLoad() {
    this.loadPageList();
  },
  onShow() {
    this.getTabBar().setData({ active: "3" });
  },
  onPullDownRefresh() {
    // 时间限制判断
    const currentTime = Date.now();
    const timeInterval = 1000; // 时间限制间隔，单位为毫秒
    if (
      currentTime - this.data.lastRequestTime < timeInterval ||
      !this.data.canRequest
    ) {
      wx.showToast({
        title: "操作过于频繁，请稍后再试",
        icon: "none",
      });
      wx.stopPullDownRefresh();
      return;
    }
    // 下拉刷新
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
    });
    wx.stopPullDownRefresh();
  },
  onReachBottom() {
    // 时间限制判断
    const currentTime = Date.now();
    const timeInterval = 1000; // 时间限制间隔，单位为毫秒
    if (
      currentTime - this.data.lastRequestTime < timeInterval ||
      !this.data.canRequest
    ) {
      wx.showToast({
        title: "操作过于频繁，请稍后再试",
        icon: "none",
      });
      return;
    }
    // 上拉加载更多
    wx.showToast({
      title: `我是有底线的！`,
      icon: "none",
    });
  },
});
