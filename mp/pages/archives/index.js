// index.js
// 获取应用实例
const app = getApp();
// 缓存数据的键名
const ARCHIVES_CACHE_KEY = "archivesCache";
// 缓存过期时间（毫秒）
const CACHE_EXPIRATION_TIME = 1 * 24 * 60 * 60 * 1000; // 一天

Page({
  data: {
    archivesCount: 0,
    archivesList: [],
    showArticleList: false,
    emptyContentText: "暂无内容",
    currentYear: app.globalData.currentYear,
    lastRequestTime: 0, // 最后一次发起请求的时间
    canRequest: true, // 是否可以发起新的请求
  },
  onShareAppMessage: function () {
    // 设置分享的标题、路径和图片
    return {
      title: "如默星空-归档",
      path: "/pages/archives/index",
      // imageUrl: this.data.articleDetail.coverImage, // 设置分享图片，根据你的实际情况修改
    };
  },
  onShareTimeline: function () {
    // 设置分享到朋友圈的标题和路径
    return {
      title: "如默星空-归档",
      query: "",
    };
  },
  // 数据转换
  transformData(data) {
    let formattedData = [];
    for (let year in data) {
      let yearObj = {
        year: year,
        months: [],
      };
      for (let month in data[year]) {
        let monthObj = {
          month: month,
          dates: [],
        };
        for (let item of data[year][month]) {
          let dateObj = {
            date: item.day,
            title: item.title,
            cid: item.cid,
          };
          monthObj.dates.push(dateObj);
        }
        monthObj.dates.sort((a, b) => a.date - b.date);
        yearObj.months.push(monthObj);
      }
      yearObj.months.sort((a, b) => b.month - a.month);
      formattedData.push(yearObj);
    }
    formattedData.sort((a, b) => b.year - a.year);
    return formattedData;
  },

  loadArchivesList() {
    // 先尝试从本地存储中读取缓存数据
    const cachedData = wx.getStorageSync(ARCHIVES_CACHE_KEY);
    if (cachedData) {
      // 检查缓存是否过期
      const currentTime = new Date().getTime();
      const cacheExpirationTime = cachedData.timestamp + CACHE_EXPIRATION_TIME;
      if (currentTime < cacheExpirationTime) {
        // 缓存未过期，使用缓存数据
        const transformedData = this.transformData(cachedData.data);
        this.setData({
          archivesList: transformedData,
          archivesCount: cachedData.count,
        });
        // 更新 showArticleList 的值
        if (cachedData.count != 0) {
          this.setData({
            showArticleList: true,
          });
        } else {
          this.setData({
            showArticleList: false,
            emptyContentText: "暂无内容",
          });
        }
        return;
      }
    }
    // 缓存不存在或已过期，调用接口获取数据
    wx.showLoading({
      title: "加载中",
    });
    const that = this;
    const url = app.globalData.baseURL + "/archives";
    wx.request({
      url: url,
      method: "GET",
      data: {
        order: "desc",
        showContent: false,
      },
      success: function (res) {
        if (res.statusCode === 200) {
          const data = res.data.data;
          const transformedData = that.transformData(data.dataSet);
          that.setData({
            archivesList: transformedData,
            archivesCount: data.count,
          });
          // 将数据缓存到本地存储
          const cacheData = {
            data: data.dataSet,
            count: data.count,
            timestamp: new Date().getTime(),
          };
          wx.setStorageSync(ARCHIVES_CACHE_KEY, cacheData);
        } else {
          console.error("请求失败");
          wx.showToast({
            title: "获取归档列表失败！",
            icon: "none",
          });
          that.setData({
            showArticleList: false,
            emptyContentText: "内容获取失败",
          });
        }
        wx.hideLoading();
      },
      fail: function (error) {
        wx.hideLoading();
        console.error(error);
        wx.showToast({
          title: "获取归档列表失败！",
          icon: "none",
        });
      },
    });
  },
  // 监听页面滚动事件
  onPageScroll(event) {
    const scrollTop = event.scrollTop;
    this.setData({
      scrollTop: scrollTop,
    });
  },
  onLoad() {
    this.loadArchivesList();
  },
  onShow() {
    this.getTabBar().setData({ active: "2" });
  },
  onPullDownRefresh() {
    // 时间限制判断
    const currentTime = Date.now();
    const timeInterval = 3000; // 时间限制间隔，单位为毫秒
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
      title: "刷新成功",
      icon: "success",
    });
    wx.stopPullDownRefresh();
  },
  onReachBottom() {
    // 时间限制判断
    const currentTime = Date.now();
    const timeInterval = 3000; // 时间限制间隔，单位为毫秒
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
