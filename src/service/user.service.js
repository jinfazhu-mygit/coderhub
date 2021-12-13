const connections = require('../app/database');

class UserService {
  async create(user) {
    // 将user存储到数据库中
    const { name, password } = user;
    const statement = `INSERT INTO users (name, password) VALUES (?, ?);`;
    const result = await connections.execute(statement, [name, password]);
    return result[0];
  }
  // 判断用户是否已经存在
  async getUserByName(name) {
    const statement = `SELECT * FROM users WHERE name = ?;`
    const result = await connections.execute(statement, [name]);
    return result[0];
  }
  // 更新头像
  async updateAvatarByUserId(avatar_url, user_id) {
    console.log(avatar_url, user_id);
    const statement = `UPDATE users SET avatar_url = ? WHERE id = ?;`;
    const [result] = await connections.execute(statement, [avatar_url, user_id]);

    return result;
  }
}

module.exports = new UserService();