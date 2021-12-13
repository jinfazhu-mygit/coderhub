const connection = require('../app/database');

class AuthService {
  async checkResource(tableName, id, userId) {
    const statement =`SELECT * FROM ${tableName} WHERE id = ? AND user_id = ?;`;
    const [result] = await connection.execute(statement, [id, userId]);
    let isPermission = !result[0] ? false: true;
    return isPermission;
  };
}

module.exports = new AuthService();