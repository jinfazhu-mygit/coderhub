const service = require('../service/comment.service');

class CommentController {
  async create(ctx, next) {
    const { id } = ctx.user;
    const { content, moment_id } = ctx.request.body;
    console.log(content);
    const result = await service.create(id, content, moment_id);
    ctx.body = result;
  }

  async reply(ctx, next) {
    const { id } = ctx.user;
    const { content, moment_id } = ctx.request.body;
    const { commentId } = ctx.params;
    const result = await service.reply(id, content, moment_id, commentId);
    ctx.body = result;
  }

  async update(ctx, next) {
    const { commentId } = ctx.params;
    const { content } = ctx.request.body;
    const result = await service.update(commentId, content);
    ctx.body = result;
  }

  async remove(ctx, next) {
    const { commentId } = ctx.params;
    const result = await service.remove(commentId);
    ctx.body = result;
  }

  async query(ctx, next) {
    const { momentId } = ctx.query;
    console.log(momentId);
    const result = await service.getCommentsByMomentId(momentId);
    ctx.body = result;
  }
}

module.exports = new CommentController();