
const productosService = require('../services/productos');
const { z } = require('zod');

// Esquema de validación Zod
const productoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'El stock debe ser mayor o igual a 0')
});

module.exports = {
  getAll: async (req, res) => {
    // Paginación y ordenamiento
    const { page = 1, limit = 10, sort } = req.query;
    const result = await productosService.getAll({ page, limit, sort });
    res.json(result);
  },
  getById: async (req, res) => {
    const id = req.params.id;
    const producto = await productosService.getById(id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  },
  create: async (req, res) => {
    try {
      const datos = productoSchema.parse(req.body);
      const nuevo = await productosService.create(datos);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(400).json({ error: err.errors?.[0]?.message || 'Datos inválidos' });
    }
  },
  update: async (req, res) => {
    const id = req.params.id;
    try {
      const datos = productoSchema.parse(req.body);
      const actualizado = await productosService.update(id, datos);
      if (!actualizado) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(actualizado);
    } catch (err) {
      res.status(400).json({ error: err.errors?.[0]?.message || 'Datos inválidos' });
    }
  },
  remove: async (req, res) => {
    const id = req.params.id;
    const eliminado = await productosService.remove(id);
    if (!eliminado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado' });
  }
};
