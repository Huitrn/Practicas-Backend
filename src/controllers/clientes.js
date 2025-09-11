const clientesService = require('../services/clientes');

module.exports = {
  getAll: async (req, res) => {
    const clientes = await clientesService.getAll();
    res.json(clientes);
  },
  getById: async (req, res) => {
    const cliente = await clientesService.getById(req.params.id);
    if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(cliente);
  },
  create: async (req, res) => {
    try {
      const { nombre, email } = req.body;
      if (!nombre || !email || nombre.trim() === '' || email.trim() === '') {
        return res.status(400).json({ error: 'Nombre y email son requeridos' });
      }
      const nuevo = await clientesService.create(req.body);
      res.status(201).json(nuevo);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  update: async (req, res) => {
    try {
      const actualizado = await clientesService.update(req.params.id, req.body);
      if (!actualizado) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.json(actualizado);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  remove: async (req, res) => {
    try {
      const eliminado = await clientesService.remove(req.params.id);
      if (!eliminado) return res.status(404).json({ error: 'Cliente no encontrado' });
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
