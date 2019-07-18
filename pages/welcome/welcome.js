Page({
  data: {
    show:null
  },
  onLoad: function (options) {
    var _this=this;
    var animation = wx.createAnimation({});
    this.init(animation);
    setTimeout(function () {
      _this.fadeIn(animation);
    }, 800);
    setTimeout(function () {
      _this.fadeOut(animation);
    }, 3000);
  },
  onReady: function () {
    var _this = this;
    setTimeout(function () {
      wx.redirectTo({
        url: '../index/index',
      })
    }, 4500);
  },
  init: function (animation){
    animation.opacity(0).step({
      duration: 0
    })
    this.setData({
      show: animation.export()
    })
  },
  fadeIn: function (animation){
    var _this=this;
    //淡出
    animation.opacity(1).step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      show: animation.export()
    });
  },
  fadeOut: function (animation){
    var _this = this;
    //淡出
    animation.opacity(0).step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      show: animation.export()
    });
  }
})