const connection = require('../app/database');

class CommentService {
  async create(user_id, content, moment_id) {
    const statement = `INSERT INTO comment (content, user_id, moment_id) VALUES (?, ?, ?);`;
    const [result] = await connection.execute(statement, [content, user_id, moment_id]);
    return result;
  }

  async reply(user_id, content, moment_id, comment_id) {
    const statement = `INSERT INTO comment (content, user_id, moment_id, comment_id) VALUES (?, ?, ?, ?);`;
    const [result] = await connection.execute(statement, [content, user_id, moment_id, comment_id]);
    return result;
  }

  async update(commentId, content) {
    const statement = `UPDATE comment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, commentId]);
    return result;
  }

  async remove(commentId) {
    const statement = `DELETE FROM comment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [commentId]);
    return result;
  }

  async getCommentsByMomentId(momentId) {
    const statement = `
    SELECT 
      c.id id, c.content content, c.createAt createTime,
    	JSON_OBJECT('id', u.id, 'name', u.name) user
    FROM comment c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.moment_id = ?;
    `;
    const [result] = await connection.execute(statement, [momentId]);
    console.log(result);
    return result;
  }
}

module.exports = new CommentService();