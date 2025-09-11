const pool = require('../db.js');

module.exports = {
  getAll: async (query) => {
    const { clienteId, estado, sort = 'fecha,desc', page = 1, limit = 10 } = query;
    const [campo, orden] = sort.split(',');
    let where = [];
    let values = [];
    let idx = 1;
    if (clienteId) {
      where.push(`clienteId = $${idx}`);
      values.push(clienteId);
      idx++;
    }
    if (estado) {
      where.push(`estado = $${idx}`);
      values.push(estado);
      idx++;
    }
    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const offset = (page - 1) * limit;
    const queryText = `SELECT * FROM "Pedido" ${whereClause} ORDER BY ${campo} ${orden.toUpperCase()} OFFSET $${idx} LIMIT $${idx+1}`;
    values.push(offset, limit);
    const res = await pool.query(queryText, values);
    return res.rows;
  },
  getById: async (id) => {
    const res = await pool.query('SELECT * FROM "Pedido" WHERE id = $1', [id]);
    return res.rows[0];
  },
  create: async (data) => {
    // Validar pedido duplicado (por clienteId, fecha y estado)
    const existe = await pool.query('SELECT * FROM "Pedido" WHERE clienteId = $1 AND fecha = $2 AND estado = $3', [data.clienteId, data.fecha, data.estado]);
    if (existe.rows.length > 0) {
      const err = new Error('Pedido duplicado');
      err.code = 409;
      throw err;
    }
    const res = await pool.query(
      'INSERT INTO "Pedido" (clienteId, fecha, estado, total, creadoEn) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
      [data.clienteId, data.fecha, data.estado, data.total]
    );
    return res.rows[0];
  },
  update: async (id, data) => {
    const res = await pool.query(
      'UPDATE "Pedido" SET clienteId = $1, fecha = $2, estado = $3, total = $4 WHERE id = $5 RETURNING *',
      [data.clienteId, data.fecha, data.estado, data.total, id]
    );
    return res.rows[0];
  },
  remove: async (id) => {
    const res = await pool.query('DELETE FROM "Pedido" WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }
};
