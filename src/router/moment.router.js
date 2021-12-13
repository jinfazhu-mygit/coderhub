const Router = require('koa-router');

const momentRouter = new Router({prefix: '/moment'});

const {
  verifyAuth,
  verifyPermission
} = require('../middleWare/auth.middleware');
const {
  verifyLabelExists // 验证标签是否存在，不存在则添加
} = require('../middleWare/label.middleware');
const {
  create,
  detail,
  list,
  update,
  remove,
  addLabels,
  fileInfo
} = require('../controller/moment.controller');

// 动态相关接口
momentRouter.post('/', verifyAuth, create);
momentRouter.get('/', list);
momentRouter.get('/:momentId', detail);
// momentRouter.patch('/:momentId', verifyAuth, verifyPermission("moment"), update); // 权限查询函数封装
// momentRouter.delete('/:momentId', verifyAuth, verifyPermission("moment"), remove);
momentRouter.patch('/:momentId', verifyAuth, verifyPermission, update);
momentRouter.delete('/:momentId', verifyAuth, verifyPermission, remove);

// 给动态添加标签接口
momentRouter.post('/:momentId/labels', verifyAuth, verifyPermission, verifyLabelExists, addLabels);
// 动态获取图片
momentRouter.get('/images/:filename', fileInfo);

module.exports = momentRouter;
