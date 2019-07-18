// pages/welcome/welcome.js
const markdown = require('./demo.md');
const app = getApp();
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    userInfo: {},
    markdown: markdown,
    touchS: [0, 0],
    touchE: [0, 0],
    type: 'index',
    centerAnimation:null,
    topAnimation:null,
    levelText: '未激活'
  },
  login: function (userInfos) {
    var that = this;
    wx.login({
      success: function (res) {
        wx.request({
          //获取openid接口  
          url: 'https://sakurasmile.cn/jscode2session',
          data: {
            code: res.code,
            encryptedData: userInfos.detail.encryptedData,
            iv: userInfos.detail.iv
          },
          method: 'GET',
          success: function (res) {
            console.log(res)
          }
        })
      }
    })
    //app.onLaunch();
    app.globalData.userInfo = userInfos.detail.userInfo;
    //wx.setStorage({
    //  key: "userInfo",
    //  data: userInfos.detail.userInfo
    //});
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
    console.log(app.globalData.userInfo);
  },
  onLoad: function(){
    console.log(app.globalData.userInfo);
    this.drawRing();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    }
  },
  onReady: function(){
  },
  toWelcome: function(){
    wx.redirectTo({
      url: '../welcome/welcome',
    })
  }, touchStart: function (e) {
    // console.log(e.touches[0].pageX)
    let sx = e.touches[0].pageX
    let sy = e.touches[0].pageY
    this.data.touchS = [sx, sy]
  },
  touchMove: function (e) {
    let sx = e.touches[0].pageX;
    let sy = e.touches[0].pageY;
    this.data.touchE = [sx, sy];
  },
  touchEnd: function (e) {
    console.log(this.data.type);
    const _this = this;
    let start = this.data.touchS
    let end = this.data.touchE
    var animation = wx.createAnimation({});
    if (start[0] < end[0] - 50) {
      console.log('右滑')
    } else if (start[0] > end[0] + 50) {
      console.log('左滑')
      this.drawRing('levelBg');
    } else if (start[1] > end[1] + 50) {
      console.log('上滑');
      if (this.data.type == 'activeCode') {
        //this.backTop(animation);
        this.showCenter(animation);
        this.setData({
          type: 'index'
        });
      }
    } else if (start[1] < end[1] - 50) {
      console.log('下滑')
      if (this.data.type == 'index') {
        this.hideCenter(animation);
        // this.enlargeTop(animation);
        this.setData({
          type: 'activeCode'
        });
      }
    } else {
      console.log('静止')
    }
  },
  hideCenter: function (animation){
    var _this = this;
    animation.opacity(0).translateY(190).step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      centerAnimation: animation.export()
    });
  },
  showCenter: function (animation) {
    var _this = this;
    animation.opacity(1).height('67%').translateY(0).step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      centerAnimation: animation.export()
    });
  },
  enlargeTop: function (animation) {
    var _this = this;
    animation.opacity(1).height(490).step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      topAnimation: animation.export()
    });
  },
  backTop: function (animation) {
    var _this = this;
    animation.opacity(1).height(290).step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      topAnimation: animation.export()
    });
  },
  drawRing: function () {
    const context = wx.createCanvasContext('levelBg')
    context.setLineWidth(5);
    var gradient = context.createLinearGradient(200, 100, 100, 200);
    gradient.addColorStop("0", "#783169");
    gradient.addColorStop("0.5", "#e7201b");
    gradient.addColorStop("1.0", "#fff100");
    context.setStrokeStyle(gradient);
    context.setLineCap('round') // 设置圆环端点的形状
    context.beginPath();//开始一个新的路径
    context.arc(40, 40, 35, 0, 2 * Math.PI, false);
    context.stroke();//对当前路径进行描边
    context.draw();
  }
});