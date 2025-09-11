// Endpoint para refrescar JWT usando refreshToken
const jwt = require('jsonwebtoken');
const userModel = require('./userModel');

// Simulación de almacenamiento de refresh tokens (en memoria)
const refreshTokens = [];
const revokedTokens = [];

module.exports = async function refreshToken(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.includes(refreshToken) || revokedTokens.includes(refreshToken)) {
    return res.status(401).json({ error: 'Refresh token inválido o revocado' });
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await userModel.findByEmail(payload.email);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    const newToken = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token: newToken });
  } catch (err) {
    return res.status(401).json({ error: 'Refresh token expirado o inválido' });
  }
}

// Exportar para registrar refresh tokens y blacklist
module.exports.refreshTokens = refreshTokens;
module.exports.revokedTokens = revokedTokens;

// Endpoint para revocar refresh tokens
module.exports.revoke = function (req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    return res.status(401).json({ error: 'Refresh token inválido' });
  }
  revokedTokens.push(refreshToken);
  res.json({ mensaje: 'Refresh token revocado' });
}
