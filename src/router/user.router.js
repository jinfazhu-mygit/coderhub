const Router = require('koa-router');
const {
  create,
  avatarInfo
} = require('../controller/user.controller')
const {
  verifyUser,
  handlePassword
} = require('../middleWare/user.middleware');

// 用户注册相关接口
const userRouter = new Router({prefix: '/users'});

userRouter.post('/', verifyUser, handlePassword, create); // 中间件拦截用户信息，进行验证
userRouter.get('/:userId/avatar', avatarInfo); // 获取头像信息

module.exports = userRouter;