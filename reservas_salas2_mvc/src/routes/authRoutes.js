const express = require('express');
const router = express.Router();

const { login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/perfil
// Ruta protegida para validar el token JWT
router.get('/perfil', authMiddleware, (req, res) => {
  res.status(200).json({
    estado: 'ok',
    mensaje: 'Token válido',
    usuario: req.usuario
  });
});

module.exports = router;