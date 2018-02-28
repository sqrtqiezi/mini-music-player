//app.js
const AV = require("./libs/av-weapp-min.js");
const config = require('./config/index.js');
App({
  onLaunch: function() {
    // 初始化 LeanCloud
    AV.init({
      appId: config.APP_ID,
      appKey: config.APP_KEY
    });

    this.globalData.AV = AV;
    this.globalData.audioManager = wx.getBackgroundAudioManager();
  },
  globalData: {
    userInfo: null,
    AV: null,
    audioManager: null
  }
});
