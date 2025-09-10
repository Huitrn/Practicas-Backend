require('dotenv').config();
// Punto de entrada principal
const express = require('express');
const app = express();

const productosRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const pedidosRoutes = require('./routes/pedidos');

app.use(express.json());
app.use('/productos', productosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/pedidos', pedidosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
