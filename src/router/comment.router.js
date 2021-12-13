const Router = require('koa-router');

const {
  verifyAuth, 
  verifyPermission
} = require('../middleWare/auth.middleware');
const {
  create,
  reply,
  update,
  remove,
  query
} = require('../controller/comment.controller');

const commentRouter = new Router({prefix: '/comment'});

commentRouter.post('/', verifyAuth, create);
commentRouter.post('/reply/:commentId', verifyAuth, reply);
// commentRouter.patch('/:commentId', verifyAuth, verifyPermission("comment"), update);
commentRouter.patch('/:commentId', verifyAuth, verifyPermission, update);
commentRouter.delete('/:commentId', verifyAuth, verifyPermission, remove);
commentRouter.get('/', query);

module.exports = commentRouter;
