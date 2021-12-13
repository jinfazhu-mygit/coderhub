const errorTypes = require('../constants/error-types');
const service = require('../service/user.service');
const md5password = require('../utils/password-handle');

const verifyUser = async (ctx, next) => { // 拦截并验证信息
  // 1.获取用户名和密码
  const { name, password } = ctx.request.body;
  // console.log(name,password);
  // 2.判断用户名或密码不存在或为空
  if(!name || ! password){
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit('error', error, ctx);
  }
  // 3.判断用户名重复
  const result = await service.getUserByName(name); // 查数据库
  if(result.length) {
    const error = new Error(errorTypes.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx);
  }

  await next();
}
// 密码加密
const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  ctx.request.body.password = md5password(password);
  await next();
}

module.exports = {
  verifyUser,
  handlePassword
};