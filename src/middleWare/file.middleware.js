const path = require('path');
const Jimp = require('jimp');

const Multer = require('koa-multer');
const { AVATAR_PATH, PICTURE_PATH } = require('../constants/file-path');

const avatarUpload = Multer({ // 保存文件
  dest: AVATAR_PATH
});

const pictureUpload = Multer({ // 保存文件
  dest: PICTURE_PATH
});

const avatarHandler = avatarUpload.single('avatar');

const pictureHandler = pictureUpload.array('picture', 9); // 最多九张图片

// 存储不同大小的图片
const pictureResize = async (ctx, next) => {
  try {
    // 1.获取所有的图像信息
    const files = ctx.req.files;
    // 2.对图像进行处理(sharp或jimp库)
    for (let file of files) {
      const destPath = path.join(file.destination, file.filename);
      Jimp.read(file.path).then(image => { // 生成三种大小的图片
        image.resize(1280, Jimp.AUTO).write(`${destPath}-large`);
        image.resize(640, Jimp.AUTO).write(`${destPath}-middle`);
        image.resize(320, Jimp.AUTO).write(`${destPath}-small`);
      })
    }

    await next();
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  avatarHandler,
  pictureHandler,
  pictureResize
}