// custom-tab-bar/index.js
Component({
  data: {
    active: "0",
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        id: "0",
        icon: "home-o",
      },
      {
        pagePath: "/pages/category/index",
        text: "分类",
        id: "1",
        icon: "apps-o",
      },
      {
        pagePath: "/pages/archives/index",
        text: "归档",
        id: "2",
        icon: "clock-o",
      },
      {
        pagePath: "/pages/about/index",
        text: "关于",
        id: "3",
        icon: "like-o",
      },
    ],
  },

  methods: {
    onChange(event) {
      // console.log(event, "eee");
      // this.setData({ active: event.detail });
      wx.switchTab({
        url: this.data.list[Number(event.detail)].pagePath,
      });
    },
    init() {
      const page = getCurrentPages().pop();
      this.setData({
        active: this.data.list.findIndex(
          (item) => item.pagePath === `/${page.route}`
        ),
      });
    },
  },
});
