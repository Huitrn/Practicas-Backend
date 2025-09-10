
require('dotenv').config();
const pool = require('../src/db');

async function seed() {
  // Insertar clientes
  await pool.query('INSERT INTO "Cliente" (nombre, email) VALUES ($1, $2)', ['Juan Pérez', 'juan@example.com']);
  await pool.query('INSERT INTO "Cliente" (nombre, email) VALUES ($1, $2)', ['Ana López', 'ana@example.com']);

  // Insertar pedidos
  await pool.query('INSERT INTO "Pedido" (clienteId, fecha, estado, total) VALUES ($1, $2, $3, $4)', [1, '2025-09-09', 'pendiente', 150.00]);
  await pool.query('INSERT INTO "Pedido" (clienteId, fecha, estado, total) VALUES ($1, $2, $3, $4)', [2, '2025-09-08', 'completado', 200.00]);

  // Insertar productos
  await pool.query('INSERT INTO "Producto" (nombre, descripcion, precio) VALUES ($1, $2, $3)', ['Ejemplo', 'Producto de prueba', 10.99]);

  console.log('Datos de ejemplo insertados correctamente.');
  await pool.end();
}

seed().catch(err => {
  console.error('Error al insertar datos:', err);
  pool.end();
});
