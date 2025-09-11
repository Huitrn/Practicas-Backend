const bcrypt = require('bcrypt');
const userModel = require('./userModel');
const passwordUtils = require('./passwordUtils');

module.exports = async function register(req, res) {
  try {
    const { email, password, nombre, role } = req.body;
    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    if (!passwordUtils.isStrongPassword(password)) {
      return res.status(400).json({ error: 'Contraseña débil' });
    }
    const existe = await userModel.findByEmail(email);
    if (existe) {
      return res.status(409).json({ error: 'Email ya registrado' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ email, nombre, password: hash, role: role || 'user' });
    res.status(201).json({ mensaje: 'Usuario registrado', user: { id: user.id, email: user.email, nombre: user.nombre, role: user.role } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
