const userService = require('../service/user.service');
const fileService = require('../service/file.service');
const { AVATAR_PATH } = require('../constants/file-path');
const fs = require('fs');

class UserController {
  async create(ctx, next) {
    // 获取用户请求传递的参数
    const user = ctx.request.body;
    // 操作数据
    const result = await userService.create(user);

    // 返回数据
    ctx.body = result;
  }

  async avatarInfo(ctx, next) {
    // 1.用户的头像是哪一个文件?
    const { userId } = ctx.params;
    const avatarInfo = await fileService.getAvatarByUserId(userId);
    console.log(avatarInfo);
    // 提供图像信息
    ctx.response.set('content-type', avatarInfo.mimetype); // 设置文件返回类型
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`); // 读取服务器文件
  }
}

module.exports = new UserController();


// const create = async (ctx, next) => {
//   const user = ctx.request.body;
//   const result = await service.create(user);
//   ctx.body = result;
// }

// module.exports = {
//   create
// }