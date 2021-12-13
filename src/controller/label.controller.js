const service = require('../service/label.service');

class LabelController {
  async create(ctx, next) {
    const { name } = ctx.request.body;
    const result = await service.create(name);
    ctx.body = result;
  }

  async labelList(ctx, next) {
    const { offset, limit } = ctx.query;
    const result = await service.labelList(offset, limit);
    ctx.body = result;
  }
}

module.exports = new LabelController();