基于小程序的高仿网易云音乐播放器
-----------------------

![](https://ws2.sinaimg.cn/large/006tNc79gy1fowo3rrx4qj30a00hs0sz.jpg)

## 数据初始化

本 Demo 的所有模拟数据均在 `migrations\data` 目录中，运行 Demo 需要参考如下步骤将数据导入 `LeanCloud` 中（小程序有很多地方限制访问本地数据）：

1. 注册 [LeanCloud](https://leancloud.cn/) 
2. 新建一个应用，然后把应用的 `APP_ID` 和 `APP_KEY` 填入 `src\config\index.js` 之中
3. 执行 `npm install && npm run migrate` ，等待数据导入成功

## 运行方式

1. 完成数据初始化之后，用 `微信开发者工具` 打开 `src` 目录
2. 如需手机预览，需参考 [这里](https://leancloud.cn/docs/weapp.html#hash-1036301770) 为 `LeanCloud` 设置微信后台服务器域名白名单