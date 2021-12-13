const fileService = require('../service/file.service');
const userService = require('../service/user.service');
const { APP_HOST, APP_PORT } = require('../app/config');

class FileController {
  async saveAvatarInfo(ctx, next) {
    // 1.获取图像相关信息
    const { mimetype, filename, size } = ctx.req.file;
    const { id } = ctx.user;
    console.log(ctx.req.file);
    // 2.将图像数据保存到数据库中
    const result = await fileService.createAvatar(filename, mimetype, size, id);
    // 3.将图片地址保存到users表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    // 4.将图片更新到数据库users表中的avatar_url
    await userService.updateAvatarByUserId(avatarUrl, id);
    // 5.返回结果
    ctx.body = {
      statusCode: 200,
      message: '用户上传头像成功'
    };
  }

  async savePictureInfo(ctx, next) {
    // 获取图像信息
    const files = ctx.req.files;
    const { id } = ctx.user;
    const { momentId } = ctx.query;
    // 将所有的文件信息保存到数据库
    for (let file of files) {
      console.log(file);
      const { mimetype, filename, size } = file;
      await fileService.createFile(filename, mimetype, size, id, momentId);
    }

    ctx.body = '动态配图上传完成';
  }
}

module.exports = new FileController();