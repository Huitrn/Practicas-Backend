const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('./userModel');
const { refreshTokens } = require('./refresh');

module.exports = async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  const user = await userModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const token = jwt.sign(
    { sub: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  // Generar refresh token
  const refreshToken = jwt.sign(
    { email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  refreshTokens.push(refreshToken);
  res.json({ token, refreshToken, user: { id: user.id, email: user.email, nombre: user.nombre, role: user.role } });
}
