const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidos');

router.get('/', pedidosController.getAll);
router.get('/:id', pedidosController.getById);
router.post('/', pedidosController.create);
router.put('/:id', pedidosController.update);
router.delete('/:id', pedidosController.remove);

module.exports = router;
