// index.js
// 获取应用实例
const app = getApp();
Page({
  data: {
    articleDetail: {},
    currentYear: app.globalData.currentYear,
    showComments: false,
    page: 1,
    pageSize: 5,
    hasMore: true,
    commentsDetail: [],
    imgURL: "",
    emptyContentText: "暂无评论",
  },
  // 监听页面滚动事件
  onPageScroll(event) {
    const scrollTop = event.scrollTop;
    this.setData({
      scrollTop: scrollTop,
    });
  },
  onShareAppMessage: function () {
    // 设置分享的标题、路径和图片
    return {
      title: this.data.articleDetail.title, // 使用文章标题作为分享标题
      path: "/pages/articleDetail/index?cid=" + this.data.articleDetail.cid, // 设置分享路径，根据你的实际情况修改
      // imageUrl: this.data.articleDetail.coverImage, // 设置分享图片，根据你的实际情况修改
    };
  },
  onShareTimeline: function () {
    // 设置分享到朋友圈的标题和路径
    return {
      title: this.data.articleDetail.title, // 使用文章标题作为分享标题
      query: "cid=" + this.data.articleDetail.cid, // 设置分享路径参数，根据你的实际情况修改
    };
  },
  // 递归处理评论
  flattenComments(comments, level, parentAuthor = null) {
    let flattenedComments = [];
    comments.forEach((comment) => {
      comment.created = this.formatTimestamp(comment.created); // 添加这行代码
      let newComment = { ...comment, level: level, parentAuthor: parentAuthor };
      flattenedComments.push(newComment);
      if (comment.children && comment.children.length > 0) {
        let flattenedChildren = this.flattenComments(
          comment.children,
          level + 1,
          comment.author
        );
        flattenedComments = flattenedComments.concat(flattenedChildren);
      }
    });
    return flattenedComments;
  },

  // 加载文章评论数据
  loadArticleComments(cid) {
    wx.showLoading({
      title: "加载中",
    });
    const that = this;
    const url = app.globalData.baseURL + "/comments";
    wx.request({
      url: url,
      method: "GET",
      data: {
        cid: cid,
        page: this.data.page,
        pageSize: this.data.pageSize,
      },
      success: (res) => {
        if (res.statusCode === 200) {
          const data = res.data.data.dataSet;
          const flattenedComments = that.flattenComments(data, 0);
          // 将时间戳转换为时间
          data.forEach((comment) => {
            comment.created = that.formatTimestamp(comment.created);
            comment.children.forEach((childComment) => {
              childComment.created = that.formatTimestamp(childComment.created);
            });
          });
          that.setData({
            commentsDetail: that.data.commentsDetail.concat(flattenedComments),
          });
          // 判断是否还有下一页评论
          const totalPages = that.data.totalPages;
          const currentPage = that.data.page;
          const hasMore = currentPage < totalPages;
          that.setData({
            hasMore: hasMore,
          });
        } else {
          console.error("请求失败");
          wx.showToast({
            title: "获取评论内容失败！",
            icon: "none",
          });
          that.setData({
            showComments: false,
            emptyContentText: "评论获取失败",
            imgURL: "/assets/img/empty-image-error.png",
          });
        }
        wx.hideLoading();
      },
      fail: function (error) {
        wx.hideLoading();
        console.error(error);
        wx.showToast({
          title: "获取评论内容失败！",
          icon: "none",
        });
      },
    });
  },
  loadArticleDetail(cid) {
    wx.showLoading({
      title: "加载中",
    });
    const that = this;
    const url = app.globalData.baseURL + "/post";
    wx.request({
      url: url,
      method: "GET",
      data: {
        cid: cid,
      },
      success: function (res) {
        if (res.statusCode === 200) {
          const data = res.data.data;
          // console.log(data, "articleDetail");
          // 计算总页数
          const commentsNum = data.commentsNum;
          const pageSize = that.data.pageSize;
          const totalPages = Math.ceil(commentsNum / pageSize);
          that.setData({
            articleDetail: data,
            totalPages: totalPages,
          });
          if (data.commentsNum != 0) {
            that.loadArticleComments(that.data.articleDetail.cid);
            that.setData({
              showComments: true,
            });
          } else {
            that.setData({
              showComments: false,
              emptyContentText: "暂无评论",
              imgURL: "/assets/img/custom-empty-image.png",
            });
          }
        } else {
          console.error("请求失败");
          wx.showToast({
            title: "获取文章内容失败！",
            icon: "none",
          });
          const defaultData = {
            title: "oops，您访问的页面找不到了",
            commentsNum: 0,
            text: '<img src="https://cdn.rumosky.com/assets/mpblog/404.svg" alt="404" title="404">',
            categories: [
              {
                name: "未知",
              },
            ],
            date: {
              year: "2018",
              month: "04",
              day: "01",
            },
            fields: {
              Hot: {
                value: "99",
              },
              views: {
                value: "8888",
              },
            },
          };

          that.setData({
            articleDetail: defaultData,
            showComments: false,
            emptyContentText: "评论获取失败",
            imgURL: "/assets/img/empty-image-error.png",
          });
        }
        wx.hideLoading();
      },
      fail: function (error) {
        wx.hideLoading();
        console.error(error);
        wx.showToast({
          title: "获取文章内容失败！",
          icon: "none",
        });
        const defaultData = {
          title: "oops，您访问的页面找不到了",
          commentsNum: 0,
          text: '<img src="https://cdn.rumosky.com/assets/mpblog/404.svg" alt="404" title="404">',
          categories: [
            {
              name: "未知",
            },
          ],
          date: {
            year: "2018",
            month: "04",
            day: "01",
          },
          fields: {
            Hot: {
              value: "99",
            },
            views: {
              value: "8888",
            },
          },
        };

        that.setData({
          articleDetail: defaultData,
          showComments: false,
          emptyContentText: "评论获取失败",
          imgURL: "/assets/img/empty-image-error.png",
        });
      },
    });
  },
  // 时间戳转换
  formatTimestamp(timestamp) {
    // 创建一个Date对象，并传入时间戳作为参数
    var date = new Date(timestamp * 1000);

    // 使用Date对象的方法获取各种时间信息
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月份从0开始，所以需要加1
    var day = date.getDate().toString().padStart(2, "0");
    var hours = date.getHours().toString().padStart(2, "0");
    var minutes = date.getMinutes().toString().padStart(2, "0");
    // var seconds = date.getSeconds().toString().padStart(2, '0');;

    // 将时间信息格式化为字符串
    var formattedTime =
      year + "-" + month + "-" + day + " " + hours + ":" + minutes;

    // 返回转换后的时间字符串
    return formattedTime;
  },
  onPullDownRefresh() {
    // 下拉刷新
    wx.showToast({
      title: "刷新成功",
      icon: "success",
    });
    wx.stopPullDownRefresh();
  },

  onReachBottom() {
    // 上拉加载更多
    if (this.data.hasMore) {
      const nextPage = this.data.page + 1;
      this.setData({
        page: nextPage,
      });
      this.loadArticleComments(this.data.articleDetail.cid);
    } else {
      wx.showToast({
        title: "没有更多评论了",
        icon: "none",
      });
    }
  },

  onLoad(options) {
    // const cid = 1;
    const cid = options.cid;
    this.loadArticleDetail(cid);
  },
});
