//建立express服务器
const express = require('express');
const app = express();
const path = require('path');
// //指定静态文件的位置
// app.use('/', express.static(path.resolve(__dirname, '../dist/mobile/html/')));
// //监听端口号
// app.listen(8080,'m.joylive.tv');


//指定静态文件的位置
app.use('/', express.static(path.resolve(__dirname, '../')));
//监听端口号
app.listen(80,'static.joylive.tv');
