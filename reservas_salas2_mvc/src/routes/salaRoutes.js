const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const {
  listarSalas,
  obtenerSalaPorId,
  crearSala,
  actualizarSala,
  cambiarEstadoSala,
  eliminarSala
} = require('../controllers/salaController');

// GET /api/salas
router.get('/', authMiddleware, listarSalas);

// GET /api/salas/:id
router.get('/:id', authMiddleware, obtenerSalaPorId);

// POST /api/salas
router.post('/', authMiddleware, roleMiddleware('admin'), crearSala);

// PUT /api/salas/:id
router.put('/:id', authMiddleware, roleMiddleware('admin'), actualizarSala);

// PATCH /api/salas/:id/estado
router.patch('/:id/estado', authMiddleware, roleMiddleware('admin'), cambiarEstadoSala);

// DELETE /api/salas/:id
router.delete('/:id', authMiddleware, roleMiddleware('admin'), eliminarSala);

module.exports = router;