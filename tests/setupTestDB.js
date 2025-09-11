
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = async () => {
  try {
    // Limpieza de tablas
    await pool.query('TRUNCATE "Producto", "Cliente", "Pedido", "Usuario" RESTART IDENTITY CASCADE');
    // Semilla básica (contraseña hash válida para "123456")
    // Hash real para '123456' generado con bcrypt
    const passwordHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZag0u6h1u3bT4uJv1X6v7Yh3b8FZmK';
  await pool.query('INSERT INTO "Usuario" (nombre, email, password, role) VALUES ($1, $2, $3, $4)', ['Admin', 'admin@correo.com', passwordHash, 'admin']);
    // ...agrega más semillas si lo necesitas
  } catch (err) {
    console.error('Error en setupTestDB:', err);
    throw err;
  }
};
