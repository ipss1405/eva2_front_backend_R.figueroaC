const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const {
  listarReservas,
  obtenerReservaPorId,
  crearReserva,
  actualizarReserva,
  cambiarEstadoReserva,
  eliminarReserva,
  consultarDisponibilidad
} = require('../controllers/reservaController');

// GET /api/reservas/disponibilidad
// Esta ruta debe ir ANTES de /:id para que Express no confunda "disponibilidad" con un id.
router.get('/disponibilidad', authMiddleware, consultarDisponibilidad);

// GET /api/reservas
router.get('/', authMiddleware, listarReservas);

// GET /api/reservas/:id
router.get('/:id', authMiddleware, obtenerReservaPorId);

// POST /api/reservas
router.post('/', authMiddleware, crearReserva);

// PUT /api/reservas/:id
router.put('/:id', authMiddleware, roleMiddleware('admin'), actualizarReserva);

// PATCH /api/reservas/:id/estado
router.patch('/:id/estado', authMiddleware, roleMiddleware('admin'), cambiarEstadoReserva);

// DELETE /api/reservas/:id
router.delete('/:id', authMiddleware, roleMiddleware('admin'), eliminarReserva);

module.exports = router;