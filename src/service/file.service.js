const connection = require('../app/database');

class FileService {
  async createAvatar(filename, mimetype, size, userId) { // 头像上传
    const statement = `INSERT INTO avatar (filename, mimetype, size, user_id) VALUES (?, ?, ?, ?);`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, userId]);
    return result;
  }

  async getAvatarByUserId(userId) {
    console.log(userId);
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`;
    const [result] = await connection.execute(statement, [userId]);
    return result.pop();
  }
  // 上传动态图片
  async createFile(filename, mimetype, size, userId, momentId) {
    const statement = `INSERT INTO file (filename, mimetype, size, user_id, moment_id) VALUES (?, ?, ?, ?, ?);`;
    const [result] = await connection.execute(statement, [filename, mimetype, size, userId, momentId]);
    return result;
  }
  // 获取动态图片
  async getFileByFileName(filename) {
    const statement = `SELECT * FROM file WHERE filename = ?;`;
    const [result] = await connection.execute(statement, [filename]);
    return result;
  }
}

module.exports = new FileService();