const Router = require('koa-router');

const {
  avatarHandler,
  pictureHandler,
  pictureResize
} = require('../middleWare/file.middleware');
const {
  saveAvatarInfo,
  savePictureInfo
} = require('../controller/file.controller');

const {
  verifyAuth
} = require('../middleWare/auth.middleware');

const fileRouter = new Router({prefix: '/upload'});

// 头像上传,保存头像,保存头像信息
fileRouter.post('/avatar', verifyAuth, avatarHandler, saveAvatarInfo);
// 动态图片上传
fileRouter.post('/picture', verifyAuth, pictureHandler, pictureResize, savePictureInfo);

module.exports = fileRouter;