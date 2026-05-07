const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        estado: 'error',
        mensaje: 'Token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        estado: 'error',
        mensaje: 'Formato de token inválido'
      });
    }

    const usuarioDecodificado = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = usuarioDecodificado;

    next();
  } catch (error) {
    return res.status(401).json({
      estado: 'error',
      mensaje: 'Token inválido o expirado'
    });
  }
};

module.exports = authMiddleware;