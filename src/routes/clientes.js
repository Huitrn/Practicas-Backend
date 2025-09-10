const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientes');
const auth = require('../middleware/auth');
const permissions = require('../middleware/permissions');

router.get('/', auth, clientesController.getAll);
router.get('/:id', auth, clientesController.getById);
router.post('/', auth, clientesController.create);
router.put('/:id', auth, clientesController.update);
router.delete('/:id', auth, permissions('admin'), clientesController.remove);

module.exports = router;
