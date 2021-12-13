const Router = require('koa-router');

const {
  login,
  success
} = require('../controller/auth.controller');
const {
  verifyLogin,
  verifyAuth
} = require('../middleWare/auth.middleware');

const authRouter = new Router();

authRouter.post('/login', verifyLogin, login);
authRouter.get('/test', verifyAuth, success); // 授权测试

module.exports = authRouter;