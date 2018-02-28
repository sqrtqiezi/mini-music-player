基于小程序的高仿网易云音乐播放器
-----------------------

## 数据初始化

本应用的所有模拟数据均在 `migrations\data` 目录中，运行演示程序需要参考如下步骤，将数据倒入 `LeanCloud` 中（小程序有很多地方限制访问本地数据）：

1. 注册 `LeanCloud` 
2. 新建一个应用，然后把应用的 `APP_ID` 和 `APP_KEY` 填入 `config\index.js` 之中
3. 执行 `npm install && npm run migrate` ，等待数据导入成功
