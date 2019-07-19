// pages/welcome/welcome.js
const markdown = require('./notice');
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
    noticeAnimation:null,
    topAnimation:null,
    levelText: '未激活',
    userContentAnimation:null
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
    var animation1 = wx.createAnimation({});
    var animation2 = wx.createAnimation({});
    var animation3 = wx.createAnimation({});
    if (start[0] < end[0] - 50) {
      console.log('右滑')
    } else if (start[0] > end[0] + 50) {
      console.log('左滑')
      this.drawRing('levelBg');
    } else if (start[1] > end[1] + 50) {
      console.log('上滑');
      if (this.data.type == 'activeCode') {
        this.backTop(animation1);
        this.hideUserContent(animation2);
        this.showNotice(animation3);
        this.setData({
          type: 'index',
          isShowUserContent: false
        });
      }
    } else if (start[1] < end[1] - 50) {
      console.log('下滑')
      if (this.data.type == 'index') {
        this.hideNotice(animation3);
        this.showUserContent(animation2);
        this.enlargeTop(animation1);
        this.setData({
          type: 'activeCode'
        });
      }
    } else {
      console.log('静止')
    }
  },
  hideUserContent: function (animation) {
    var _this = this;
    animation.opacity(0).height('0rpx').step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      userContentAnimation: animation.export()
    });
  },
  showUserContent: function (animation) {
    var _this = this;
    animation.opacity(0).height('800rpx').step({
      delay:200,
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      userContentAnimation: animation.export()
    });
  },
  hideNotice: function (animation){
    var _this = this;
    animation.opacity(0).step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      noticeAnimation: animation.export()
    });
  },
  showNotice: function (animation) {
    var _this = this;
    animation.opacity(1).height('67%').step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      noticeAnimation: animation.export()
    });
  },
  enlargeTop: function (animation) {
    var _this = this;
    animation.opacity(1).height('94%').step({
      duration: 1200,
      timingFunction: 'ease'
    });
    _this.setData({
      topAnimation: animation.export()
    });
  },
  backTop: function (animation) {
    var _this = this;
    animation.opacity(1).height('300rpx').step({
      delay:200,
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