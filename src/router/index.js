const fs = require('fs');

const useRoutes = function () {
  fs.readdirSync(__dirname).forEach(file => { // 读取当前文件夹下除index.js外的文件
    if(file === 'index.js') return;
    const router = require(`./${file}`);
    this.use(router.routes());
    this.use(router.allowedMethods());
  })
}

module.exports = useRoutes;