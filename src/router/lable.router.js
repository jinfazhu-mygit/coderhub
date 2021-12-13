const Router = require('koa-router');

const {
  verifyAuth, 
} = require('../middleWare/auth.middleware');
const {
  create,
  labelList
} = require('../controller/label.controller');

const labelRouter = new Router({prefix: '/label'});

labelRouter.post('/',verifyAuth ,create);
// 获取标签列表
labelRouter.get('/', labelList);

module.exports = labelRouter;
