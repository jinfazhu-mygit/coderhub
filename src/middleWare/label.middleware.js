const service = require('../service/label.service');

const verifyLabelExists = async (ctx, next) => {
  const { labels } = ctx.request.body;

  const labelResults = [];
  for(let name of labels) {
    const labelResult = await service.isExistsLabel(name);
    const label = { name };
    if(!labelResult) {
      const result = await service.create(name);
      label.id = result.insertId;
    }else {
      label.id = labelResult.id;
    }
    labelResults.push(label);
  }
  ctx.labels = labelResults;

  await next();
}

module.exports = { verifyLabelExists };
