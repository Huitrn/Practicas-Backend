const pool = require('../db.js');

module.exports = {
  getAll: async () => {
    const res = await pool.query('SELECT * FROM "Cliente"');
    return res.rows;
  },
  getById: async (id) => {
    const res = await pool.query('SELECT * FROM "Cliente" WHERE id = $1', [id]);
    return res.rows[0];
  },
  create: async (data) => {
    const res = await pool.query(
      'INSERT INTO "Cliente" (nombre, email, creadoEn) VALUES ($1, $2, NOW()) RETURNING *',
      [data.nombre, data.email]
    );
    return res.rows[0];
  },
  update: async (id, data) => {
    const res = await pool.query(
      'UPDATE "Cliente" SET nombre = $1, email = $2 WHERE id = $3 RETURNING *',
      [data.nombre, data.email, id]
    );
    return res.rows[0];
  },
  remove: async (id) => {
    const res = await pool.query('DELETE FROM "Cliente" WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }
};
