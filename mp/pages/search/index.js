// index.js
// 获取应用实例
const app = getApp();
Page({
  data: {
    page: 1,
    pageSize: 10,
    articleList: [],
    hasMore: true,
    count: 0,
    imgURL: "",
    emptyContentText: "暂无内容",
    showSearchResults: false,
    currentYear: app.globalData.currentYear,
    lastRequestTime: 0, // 最后一次发起请求的时间
    canRequest: true, // 是否可以发起新的请求
  },
  onShareAppMessage: function () {
    // 设置分享的标题、路径和图片
    return {
      title: "如默星空-搜索",
      path: "/pages/search/index",
      // imageUrl: this.data.articleDetail.coverImage, // 设置分享图片，根据你的实际情况修改
    };
  },
  onShareTimeline: function () {
    // 设置分享到朋友圈的标题和路径
    return {
      title: "如默星空-搜索",
      query: "",
    };
  },
  // 监听页面滚动事件
  onPageScroll(event) {
    const scrollTop = event.scrollTop;
    this.setData({
      scrollTop: scrollTop,
    });
  },
  onSearch(event) {
    const keyword = event.detail;
    console.log(keyword, "搜索关键词");
    this.loadArticleList(keyword);
  },
  onClear() {
    this.setData({
      searchText: "",
    });
  },
  loadArticleList(keyword) {
    wx.showLoading({
      title: "加载中",
    });
    const that = this;
    const url = app.globalData.baseURL + "/posts";
    const { page, pageSize, articleList, lastRequestTime, canRequest } =
      this.data;
    // 时间限制判断
    const currentTime = Date.now();
    const timeInterval = 1000; // 设定时间间隔，单位为毫秒
    if (currentTime - lastRequestTime < timeInterval || !canRequest) {
      return;
    }
    wx.request({
      url: url,
      method: "GET",
      data: {
        page: page,
        pageSize: pageSize,
        showContent: false,
        filterType: "search",
        filterSlug: keyword,
      },
      success: function (res) {
        if (res.statusCode === 200) {
          const data = res.data.data;
          const count = data.count;
          const newArticleList = data.dataSet;
          that.setData({
            articleList: articleList.concat(newArticleList),
            count: count,
            hasMore: newArticleList.length >= pageSize,
            showBottomTip: false, // 重置底部提示的显示状态
            lastRequestTime: currentTime, // 更新最后一次请求时间
          });
          if (count != 0) {
            that.setData({
              showSearchResults: true,
            });
          } else {
            that.setData({
              showSearchResults: false,
              emptyContentText: "暂无内容",
              imgURL: "/assets/img/empty-image-search.png",
            });
          }
        } else {
          console.error("请求失败");
          wx.showToast({
            title: "获取文章失败！",
            icon: "none",
          });
          that.setData({
            showSearchResults: false,
            emptyContentText: "内容获取失败",
            imgURL: "/assets/img/empty-image-error.png",
          });
        }
        wx.hideLoading();
      },
      fail: function (error) {
        wx.hideLoading();
        console.error(error);
        wx.showToast({
          title: "获取文章失败！",
          icon: "none",
        });
      },
    });
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
    // 下拉刷新，重置页码并清空文章列表
    this.setData({
      page: 1,
      articleList: [],
      hasMore: true,
    });
    this.loadArticleList(this.data.searchText);
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
    if (this.data.hasMore) {
      const nextPage = this.data.page + 1;
      this.setData({
        page: nextPage,
      });
      this.loadArticleList(this.data.searchText);
    } else {
      wx.showToast({
        title: `没有更多文章了`,
        icon: "none",
      });
    }
  },

  onLoad(options) {
    const keyword = options.keyword ? decodeURIComponent(options.keyword) : "";
    this.setData({
      searchText: keyword,
    });
    this.loadArticleList(keyword);
  },
});
