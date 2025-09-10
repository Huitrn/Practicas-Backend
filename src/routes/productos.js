const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productos');

// Endpoints CRUD
const auth = require('../middleware/auth');
const permissions = require('../middleware/permissions');

router.get('/', productosController.getAll);
router.get('/:id', productosController.getById);
router.post('/', auth, productosController.create);
router.put('/:id', auth, productosController.update);
router.delete('/:id', auth, permissions('admin'), productosController.remove);

module.exports = router;
