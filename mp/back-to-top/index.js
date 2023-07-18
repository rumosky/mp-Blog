// back-to-top.js
Component({
  properties: {
    scrollTop: {
      type: Number,
      value: 0,
      observer(newVal) {
        this.setData({
          showBackToTop: newVal > 10
        });
      }
    }
  },
  data: {
    showBackToTop: false
  },
  methods: {
    handleBackToTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500
      });
    }
  }
});
