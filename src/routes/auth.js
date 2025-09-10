const express = require('express');
const register = require('../auth/register');
const login = require('../auth/login');
const refresh = require('../auth/refresh');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/revoke', refresh.revoke);

module.exports = router;
