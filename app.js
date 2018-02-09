//app.js
const AV = require("./libs/av-weapp-min.js");

App({
  onLaunch: function() {
    // 初始化 LeanCloud
    AV.init({
      appId: "RcQJijiiVGbsuG52OGwDrPBS-9Nh9j0Va",
      appKey: "qxjVTNIR2HG2BUE8fgaSrap4"
    });

    this.globalData.AV = AV;
  },
  globalData: {
    userInfo: null,
    AV: null
  }
});
