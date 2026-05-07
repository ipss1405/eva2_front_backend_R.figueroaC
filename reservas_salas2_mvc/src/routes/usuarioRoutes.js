const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const {
  listarUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');

// GET /api/usuarios
router.get('/', authMiddleware, roleMiddleware('admin'), listarUsuarios);

// GET /api/usuarios/:id
router.get('/:id', authMiddleware, roleMiddleware('admin'), obtenerUsuarioPorId);

// POST /api/usuarios
router.post('/', authMiddleware, roleMiddleware('admin'), crearUsuario);

// PUT /api/usuarios/:id
router.put('/:id', authMiddleware, roleMiddleware('admin'), actualizarUsuario);

// PATCH /api/usuarios/:id/estado
router.patch('/:id/estado', authMiddleware, roleMiddleware('admin'), cambiarEstadoUsuario);

// DELETE /api/usuarios/:id
router.delete('/:id', authMiddleware, roleMiddleware('admin'), eliminarUsuario);

module.exports = router;