
const pool = require('../db.js');

module.exports = {
  getAll: async ({ page = 1, limit = 10, sort }) => {
    const offset = (page - 1) * limit;
    let orderBy = 'id DESC';
    if (sort) {
      const [campo, orden] = sort.split(',');
      orderBy = `${campo} ${orden.toUpperCase()}`;
    }
    const totalRes = await pool.query('SELECT COUNT(*) FROM "Producto"');
    const total = parseInt(totalRes.rows[0].count);
    const productosRes = await pool.query(
      `SELECT * FROM "Producto" ORDER BY ${orderBy} OFFSET $1 LIMIT $2`,
      [offset, limit]
    );
    return {
      total,
      page: Number(page),
      limit: Number(limit),
      productos: productosRes.rows
    };
  },
  getById: async (id) => {
    const res = await pool.query('SELECT * FROM "Producto" WHERE id = $1', [id]);
    return res.rows[0];
  },
  create: async (datos) => {
    const res = await pool.query(
      'INSERT INTO "Producto" (nombre, descripcion, precio, creadoEn) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [datos.nombre, datos.descripcion, datos.precio]
    );
    return res.rows[0];
  },
  update: async (id, datos) => {
    const res = await pool.query(
      'UPDATE "Producto" SET nombre = $1, descripcion = $2, precio = $3 WHERE id = $4 RETURNING *',
      [datos.nombre, datos.descripcion, datos.precio, id]
    );
    return res.rows[0];
  },
  remove: async (id) => {
    const res = await pool.query('DELETE FROM "Producto" WHERE id = $1 RETURNING *', [id]);
    return res.rows[0];
  }
};

// ...existing code...
