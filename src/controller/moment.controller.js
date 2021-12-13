const fs = require('fs');

const fileService = require('../service/file.service');
const momentService = require('../service/moment.service');
const { PICTURE_PATH } = require('../constants/file-path');

class MomentController {
  async create(ctx, next) {
    // 1.获取数据(user_id, content, 图片)
    const userId = ctx.user.id;
    const content = ctx.request.body.content;

    // 2.将数据插入到数据库
    const result = await momentService.create(userId, content);
    ctx.body = result;
  }
  
  async detail(ctx, next) {
    // 1.获取数据(momentId)
    const momentId = ctx.params.momentId;
    const result = await momentService.getMomentById(momentId);
    ctx.body = result;
  }
  
  async list(ctx, next) {
    // 1.获取评论列表offset和limit
    const { offset, size } = ctx.request.query;

    const result = await momentService.getMomentList(offset, size);
    ctx.body = result;
  }

  async update(ctx, next) {
    // 获取参数
    const { momentId } = ctx.request.params;
    const { content } = ctx.request.body;
    // 修改内容
    const result = await momentService.update(content, momentId);
    ctx.body = result;
  }

  async remove(ctx, next) {
    // 获取参数
    const { momentId } = ctx.params;
    // 删除
    const result = await momentService.remove(momentId);
    ctx.body = result;
  }

  async addLabels(ctx, next) {
    // 1.获取标签id和动态id
    const { momentId } = ctx.params;
    const { labels } = ctx;
    console.log(momentId);
    console.log(labels);
    // 2.添加标签
    for (let label of labels) {
      // 2.1判断动态是否已经和标签关联
      const isExists = await momentService.hasLabel(momentId, label.id);
      if(!isExists) {
        await momentService.momentAddLabel(momentId, label.id);
      }
    }
    ctx.body = "动态添加标签成功";
  }

  async fileInfo(ctx, next) {
    let { filename } = ctx.params;
    const fileInfo = await fileService.getFileByFileName(filename);

    const { type } = ctx.request.query;
    const types = ["small", "middle", "large"];
    if (types.some(item => item === type)) {
      filename = filename + '-' + type;
    }

    ctx.response.set('content-type', fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}`);
  }
}

module.exports = new MomentController();