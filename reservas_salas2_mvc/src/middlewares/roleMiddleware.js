
const roleMiddleware = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        estado: 'error',
        mensaje: 'Usuario no autenticado'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        estado: 'error',
        mensaje: 'No tiene permisos para realizar esta acción'
      });
    }

    next();
  };
};

module.exports = roleMiddleware;