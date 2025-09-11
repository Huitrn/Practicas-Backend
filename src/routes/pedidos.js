const express = require('express');
const router = express.Router();
const controlador = require('../controllers/pedidos');
const auth = require('../middleware/auth');
const permissions = require('../middleware/permissions');

router.get('/', auth, controlador.getAll);
router.get('/:id', auth, controlador.getById);
router.post('/', auth, controlador.create);
router.put('/:id', auth, controlador.update);
router.delete('/:id', auth, permissions('admin'), controlador.remove);

module.exports = router;
