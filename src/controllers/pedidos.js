const pedidosService = require('../services/pedidos');

module.exports = {
  getAll: async (req, res) => {
    const pedidos = await pedidosService.getAll(req.query);
    res.json(pedidos);
  },
  getById: async (req, res) => {
    const pedido = await pedidosService.getById(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  },
  create: async (req, res) => {
    try {
      const { clienteId, fecha, estado, total } = req.body;
      if (!clienteId || !fecha || !estado || total == null || clienteId === '' || fecha === '' || estado === '') {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
      }
      const nuevo = await pedidosService.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  update: async (req, res) => {
    try {
      const actualizado = await pedidosService.update(req.params.id, req.body);
      if (!actualizado) return res.status(404).json({ error: 'Pedido no encontrado' });
      res.json(actualizado);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  remove: async (req, res) => {
    try {
      const eliminado = await pedidosService.remove(req.params.id);
      if (!eliminado) return res.status(404).json({ error: 'Pedido no encontrado' });
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
