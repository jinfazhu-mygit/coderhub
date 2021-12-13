const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const errorHandler = require('./error-handle');
const useRoutes = require('../router/index');

const app = new Koa();

app.useRoutes = useRoutes; // 方法隐式绑定了到app

app.use(bodyParser());
app.useRoutes(); // 调用
app.on('error', errorHandler);


module.exports = app;