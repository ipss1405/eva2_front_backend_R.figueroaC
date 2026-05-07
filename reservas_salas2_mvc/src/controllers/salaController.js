const { Sala } = require('../models');

// GET /api/salas
const listarSalas = async (req, res) => {
  try {
    const salas = await Sala.findAll({
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Salas listadas correctamente',
      data: salas
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al listar salas',
      detalle: error.message
    });
  }
};

// GET /api/salas/:id
const obtenerSalaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const sala = await Sala.findByPk(id);

    if (!sala) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'Sala no encontrada'
      });
    }

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Sala encontrada',
      data: sala
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al obtener sala',
      detalle: error.message
    });
  }
};

// POST /api/salas
const crearSala = async (req, res) => {
  try {
    const { nombre, capacidad, ubicacion, estado } = req.body;

    if (!nombre || !capacidad || !ubicacion) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Nombre, capacidad y ubicación son obligatorios'
      });
    }

    if (!Number.isInteger(Number(capacidad)) || Number(capacidad) <= 0) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'La capacidad debe ser un número entero mayor a 0'
      });
    }

    const estadosPermitidos = ['disponible', 'no_disponible', 'mantencion'];

    if (estado && !estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Estado inválido. Use disponible, no_disponible o mantencion'
      });
    }

    const nuevaSala = await Sala.create({
      nombre,
      capacidad,
      ubicacion,
      estado: estado || 'disponible'
    });

    return res.status(201).json({
      estado: 'ok',
      mensaje: 'Sala creada correctamente',
      data: nuevaSala
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al crear sala',
      detalle: error.message
    });
  }
};

// PUT /api/salas/:id
const actualizarSala = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, capacidad, ubicacion, estado } = req.body;

    const sala = await Sala.findByPk(id);

    if (!sala) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'Sala no encontrada'
      });
    }

    if (!nombre || !capacidad || !ubicacion) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Nombre, capacidad y ubicación son obligatorios'
      });
    }

    if (!Number.isInteger(Number(capacidad)) || Number(capacidad) <= 0) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'La capacidad debe ser un número entero mayor a 0'
      });
    }

    const estadosPermitidos = ['disponible', 'no_disponible', 'mantencion'];

    if (estado && !estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Estado inválido. Use disponible, no_disponible o mantencion'
      });
    }

    await sala.update({
      nombre,
      capacidad,
      ubicacion,
      estado: estado || sala.estado
    });

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Sala actualizada correctamente',
      data: sala
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al actualizar sala',
      detalle: error.message
    });
  }
};

// PATCH /api/salas/:id/estado
const cambiarEstadoSala = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ['disponible', 'no_disponible', 'mantencion'];

    if (!estado || !estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Estado inválido. Use disponible, no_disponible o mantencion'
      });
    }

    const sala = await Sala.findByPk(id);

    if (!sala) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'Sala no encontrada'
      });
    }

    await sala.update({ estado });

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Estado de la sala actualizado correctamente',
      data: sala
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al cambiar estado de la sala',
      detalle: error.message
    });
  }
};

// DELETE /api/salas/:id
const eliminarSala = async (req, res) => {
  try {
    const { id } = req.params;

    const sala = await Sala.findByPk(id);

    if (!sala) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'Sala no encontrada'
      });
    }

    // Eliminación lógica: no borra físicamente, deja la sala no disponible.
    await sala.update({ estado: 'no_disponible' });

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Sala eliminada lógicamente correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al eliminar sala',
      detalle: error.message
    });
  }
};

module.exports = {
  listarSalas,
  obtenerSalaPorId,
  crearSala,
  actualizarSala,
  cambiarEstadoSala,
  eliminarSala
};