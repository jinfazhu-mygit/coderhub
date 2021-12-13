const connection = require('../app/database');
const sqlFragment = `
    SELECT 
      m.id id, m.content content, m.createAt create_time, m.updateAt update_time, 
      JSON_OBJECT('id', u.id, 'name', u.name) author,
      (SELECT COUNT(*) FROM moment_label WHERE moment_id = m.id) labelCount,
      (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount,
      (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename))
      FROM file WHERE m.id = file.moment_id) images
    FROM moment m
    LEFT JOIN users u ON m.user_id = u.id
`;

class MomentService {
  async create(userId, content) {
    const statement = 'INSERT INTO `moment` (user_id, content) VALUES (?, ?);';
    const [result] = await connection.execute(statement, [userId, content]);
    return result;
  }

  async getMomentById(id) {
    const statement = `
    SELECT 
      m.id id, m.content content, m.createAt createTime,
      JSON_OBJECT('id', u.id, 'name', u.name, 'avatarUrl', u.avatar_url) author,
      (SELECT COUNT(*) FROM moment_label WHERE moment_id = m.id) labelCount,
      IF(l.id, JSON_ARRAYAGG(JSON_OBJECT(
        'id', l.id, 'name', l.name
      )), NULL) labels,
      (SELECT IF(COUNT(c.id), JSON_ARRAYAGG(JSON_OBJECT(
        'id', c.id, 'content', c.content, 'createTime', c.createAt,
        'user', JSON_OBJECT('id', cu.id, 'name', cu.name, 'avatarUrl', cu.avatar_url)
      )), NULL) FROM comment c LEFT JOIN users cu ON c.user_id = cu.id WHERE m.id = c.moment_id) comments,
      (SELECT JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/', file.filename))
	  FROM file WHERE m.id = file.moment_id) images
    FROM moment m
    LEFT JOIN users u ON m.user_id = u.id
    LEFT JOIN moment_label ml ON m.id = ml.moment_id
    LEFT JOIN label l ON ml.label_id = l.id
    WHERE m.id = ?
    GROUP BY m.id;
    `;
    const [result] = await connection.execute(statement, [id])
    console.log(result);
    return result[0];
  }

  async getMomentList(offset, size) {
    const statement = `
    ${sqlFragment}
    LIMIT ? OFFSET ?;

    `;
    const [result] = await connection.execute(statement, [size, offset]);

    return result;
  }

  async update(content, id) {
    const statement = `UPDATE moment SET content = ? WHERE id = ?;`;
    const [result] = await connection.execute(statement, [content, id]);
    return result;
  }

  async remove(id) {
    console.log(id);
    const statement = `DELETE FROM moment WHERE id = ?;`;
    const [result] = await connection.execute(statement, [id]);
    return result;
  }

  async hasLabel(momentId, labelId){
    const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result[0]? true: false;
  }

  async momentAddLabel(momentId, labelId) {
    const statement = `INSERT INTO moment_label (moment_id, label_id) VALUES (?, ?);`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }

  async labelList(offset, limit) {
    const statement = `SELECT * FROM label LIMIT ?, ?;`;
    const [result] = await connection.execute(statement, [offset, limit]);
    return result;
  }
}

module.exports = new MomentService();