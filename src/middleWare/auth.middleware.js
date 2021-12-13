const jwt = require('jsonwebtoken');

const errorTypes = require('../constants/error-types');
const service = require('../service/user.service');
const authService = require('../service/auth.service');
const md5password = require('../utils/password-handle');
const { PUBLIC_KEY } = require('../app/config');

// 登陆验证
const verifyLogin = async (ctx, next) => {
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body;

  // 2.判断用户名或密码是否为空
  if(!name || ! password){
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', error, ctx);
  }
  // 3.判断用户是否存在
  const result = await service.getUserByName(name); // 查数据库
  const user = result[0];
  if(!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx);
  }
  // 4.判断密码是否正确
  const loginPassword = md5password(password); // 加密
  if(loginPassword != user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx);
  }
  
  // 拿到user相关信息
  ctx.user = user;

  await next();
}

// token验证
const verifyAuth = async (ctx, next) => {
  console.log('验证登录授权的middleware');
  // 1.获取token
  const authorization = ctx.headers.authorization;
  if(!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
  const token = authorization.replace("Bearer ", "");

  // 2.验证token
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ["RS256"]
    })
    ctx.user = result;
    await next();
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit('error', error, ctx);
  }
}

// 动态，评论，标签权限验证
// const verifyPermission = (tableName) => {
//   return async (ctx, next) => {
//     console.log('验证权限的middleware');
//     // 1.获取参数
//     const userId = ctx.user.id;
//     const [paramsId] = Object.keys(ctx.params);
//     const resourceId = ctx.params[paramsId];
//     // 2.查询数据,验证权限
//     const isPermission = await authService.checkResource(tableName, resourceId, userId );
//     if(!isPermission) {
//       const error = new Error(errorTypes.UNPERMISSION);
//       return ctx.app.emit('error', error, ctx);
//     }
  
//     await next();
//   }
// }

// 动态，评论，标签权限验证
const verifyPermission = async (ctx, next) => {
  console.log('验证权限的middleware');
  // 1.获取参数
  const [sourceName] = Object.keys(ctx.params); // 获取第一个key的name
  const tableName = sourceName.replace("Id", ""); // restful风格的参数获取tableName
  const resourceId = ctx.params[sourceName];
  const userId = ctx.user.id;
  // 2.查询数据,验证权限
  const isPermission = await authService.checkResource(tableName, resourceId, userId );
  if(!isPermission) {
    const error = new Error(errorTypes.UNPERMISSION);
    return ctx.app.emit('error', error, ctx);
  }

  await next();
}


module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
};