// Punto de entrada principal
const express = require('express');
const app = express();
const productosRoutes = require('./routes/productos');

app.use(express.json());
app.use('/productos', productosRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
