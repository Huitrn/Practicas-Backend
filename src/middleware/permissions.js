// Middleware para verificar permisos por rol
module.exports = function permissions(role) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    // Acepta tanto 'role' como 'rol' en el payload
  const userRole = req.user.role;
    if (userRole !== role) {
      return res.status(403).json({ error: 'No autorizado: requiere rol ' + role });
    }
    next();
  }
}
