require('dotenv').config();
// Punto de entrada principal
const express = require('express');
const app = express();

const productosRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const pedidosRoutes = require('./routes/pedidos');
const authRoutes = require('./routes/auth');
const pool = require('./db');


app.use(express.json());
app.use('/productos', productosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/pedidos', pedidosRoutes);
app.use('/auth', authRoutes);

// Endpoint para verificar conexión a la base de datos
app.get('/db-status', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Conexión exitosa a la base de datos' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Sin conexión a la base de datos', error: err.message });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
  });
}
