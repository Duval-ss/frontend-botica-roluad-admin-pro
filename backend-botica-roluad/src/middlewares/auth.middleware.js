const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Token requerido' });

  const token = header.startsWith('Bearer ') ? header.slice(7) : header;

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o vencido' });
  }
}

function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== 'ADMIN') {
    return res.status(403).json({ message: 'Acceso permitido solo para administrador' });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
