const { Op } = require('sequelize');
const { Reserva, Usuario, Sala, sequelize } = require('../models');

const estadosReservaPermitidos = ['pendiente', 'confirmada', 'cancelada', 'finalizada'];

const convertirHoraAMinutos = (hora) => {
  if (!hora) return null;

  const partes = String(hora).split(':');

  if (partes.length < 2) return null;

  const horas = Number(partes[0]);
  const minutos = Number(partes[1]);

  if (
    Number.isNaN(horas) ||
    Number.isNaN(minutos) ||
    horas < 0 ||
    horas > 23 ||
    minutos < 0 ||
    minutos > 59
  ) {
    return null;
  }

  return horas * 60 + minutos;
};

const validarHorarioReserva = (hora_inicio, hora_fin) => {
  const inicio = convertirHoraAMinutos(hora_inicio);
  const fin = convertirHoraAMinutos(hora_fin);

  if (inicio === null || fin === null) {
    return 'Las horas deben tener un formato válido, por ejemplo 09:00';
  }

  if (inicio >= fin) {
    return 'La hora de término debe ser mayor que la hora de inicio';
  }

  const horaApertura = 8 * 60;
  const horaCierre = 18 * 60;

  if (inicio < horaApertura || fin > horaCierre) {
    return 'Las reservas solo pueden realizarse entre 08:00 y 18:00';
  }

  return null;
};

const existeConflictoReserva = async ({
  sala_id,
  fecha,
  hora_inicio,
  hora_fin,
  reservaIdExcluir = null,
  transaction = null
}) => {
  const where = {
    sala_id,
    fecha,
    estado: {
      [Op.in]: ['pendiente', 'confirmada']
    },
    hora_inicio: {
      [Op.lt]: hora_fin
    },
    hora_fin: {
      [Op.gt]: hora_inicio
    }
  };

  if (reservaIdExcluir) {
    where.id = {
      [Op.ne]: reservaIdExcluir
    };
  }

  const opciones = { where };

  if (transaction) {
    opciones.transaction = transaction;
  }

  const reservaExistente = await Reserva.findOne(opciones);

  return reservaExistente !== null;
};

// GET /api/reservas
const listarReservas = async (req, res) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Sala,
          as: 'sala',
          attributes: ['id', 'nombre', 'ubicacion', 'estado']
        }
      ],
      order: [
        ['fecha', 'ASC'],
        ['hora_inicio', 'ASC']
      ]
    });

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Reservas listadas correctamente',
      data: reservas
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al listar reservas',
      detalle: error.message
    });
  }
};

// GET /api/reservas/:id
const obtenerReservaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const reserva = await Reserva.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: Sala,
          as: 'sala',
          attributes: ['id', 'nombre', 'ubicacion', 'estado']
        }
      ]
    });

    if (!reserva) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'Reserva no encontrada'
      });
    }

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Reserva encontrada',
      data: reserva
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al obtener reserva',
      detalle: error.message
    });
  }
};

// POST /api/reservas
const crearReserva = async (req, res) => {
  let transaction;

  try {
    const {
      usuario_id,
      sala_id,
      fecha,
      hora_inicio,
      hora_fin,
      observacion
    } = req.body;

    if (!usuario_id || !sala_id || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Usuario, sala, fecha, hora de inicio y hora de término son obligatorios'
      });
    }

    const errorHorario = validarHorarioReserva(hora_inicio, hora_fin);

    if (errorHorario) {
      return res.status(400).json({
        estado: 'error',
        mensaje: errorHorario
      });
    }

    // Se inicia una transacción para proteger la creación de la reserva.
    transaction = await sequelize.transaction();

    const usuario = await Usuario.findByPk(usuario_id, { transaction });

    if (!usuario || usuario.estado !== 'activo') {
      await transaction.rollback();

      return res.status(400).json({
        estado: 'error',
        mensaje: 'El usuario no existe o se encuentra inactivo'
      });
    }

    const sala = await Sala.findByPk(sala_id, { transaction });

    if (!sala) {
      await transaction.rollback();

      return res.status(404).json({
        estado: 'error',
        mensaje: 'La sala no existe'
      });
    }

    if (sala.estado !== 'disponible') {
      await transaction.rollback();

      return res.status(400).json({
        estado: 'error',
        mensaje: 'La sala no se encuentra disponible'
      });
    }

    const conflicto = await existeConflictoReserva({
      sala_id,
      fecha,
      hora_inicio,
      hora_fin,
      transaction
    });

    if (conflicto) {
      await transaction.rollback();

      return res.status(409).json({
        estado: 'error',
        mensaje: 'La sala no está disponible en ese horario'
      });
    }

    const nuevaReserva = await Reserva.create(
      {
        usuario_id,
        sala_id,
        fecha,
        hora_inicio,
        hora_fin,
        estado: 'pendiente',
        observacion: observacion || null
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      estado: 'ok',
      mensaje: 'Reserva creada correctamente',
      data: nuevaReserva
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al crear reserva',
      detalle: error.message
    });
  }
};

// PUT /api/reservas/:id
const actualizarReserva = async (req, res) => {
  let transaction;

  try {
    const { id } = req.params;

    const {
      usuario_id,
      sala_id,
      fecha,
      hora_inicio,
      hora_fin,
      estado,
      observacion
    } = req.body;

    if (!usuario_id || !sala_id || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Usuario, sala, fecha, hora de inicio y hora de término son obligatorios'
      });
    }

    const errorHorario = validarHorarioReserva(hora_inicio, hora_fin);

    if (errorHorario) {
      return res.status(400).json({
        estado: 'error',
        mensaje: errorHorario
      });
    }

    if (estado && !estadosReservaPermitidos.includes(estado)) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Estado inválido. Use pendiente, confirmada, cancelada o finalizada'
      });
    }

    // Se inicia una transacción para proteger la actualización de la reserva.
    transaction = await sequelize.transaction();

    const reserva = await Reserva.findByPk(id, { transaction });

    if (!reserva) {
      await transaction.rollback();

      return res.status(404).json({
        estado: 'error',
        mensaje: 'Reserva no encontrada'
      });
    }

    const usuario = await Usuario.findByPk(usuario_id, { transaction });

    if (!usuario || usuario.estado !== 'activo') {
      await transaction.rollback();

      return res.status(400).json({
        estado: 'error',
        mensaje: 'El usuario no existe o se encuentra inactivo'
      });
    }

    const sala = await Sala.findByPk(sala_id, { transaction });

    if (!sala) {
      await transaction.rollback();

      return res.status(404).json({
        estado: 'error',
        mensaje: 'La sala no existe'
      });
    }

    if (sala.estado !== 'disponible') {
      await transaction.rollback();

      return res.status(400).json({
        estado: 'error',
        mensaje: 'La sala no se encuentra disponible'
      });
    }

    const conflicto = await existeConflictoReserva({
      sala_id,
      fecha,
      hora_inicio,
      hora_fin,
      reservaIdExcluir: id,
      transaction
    });

    if (conflicto) {
      await transaction.rollback();

      return res.status(409).json({
        estado: 'error',
        mensaje: 'La sala no está disponible en ese horario'
      });
    }

    await reserva.update(
      {
        usuario_id,
        sala_id,
        fecha,
        hora_inicio,
        hora_fin,
        estado: estado || reserva.estado,
        observacion: observacion || null
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Reserva actualizada correctamente',
      data: reserva
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al actualizar reserva',
      detalle: error.message
    });
  }
};

// PATCH /api/reservas/:id/estado
const cambiarEstadoReserva = async (req, res) => {
  let transaction;

  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado || !estadosReservaPermitidos.includes(estado)) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Estado inválido. Use pendiente, confirmada, cancelada o finalizada'
      });
    }

    // Se inicia una transacción para proteger el cambio de estado.
    transaction = await sequelize.transaction();

    const reserva = await Reserva.findByPk(id, { transaction });

    if (!reserva) {
      await transaction.rollback();

      return res.status(404).json({
        estado: 'error',
        mensaje: 'Reserva no encontrada'
      });
    }

    await reserva.update({ estado }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Estado de la reserva actualizado correctamente',
      data: reserva
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al cambiar estado de la reserva',
      detalle: error.message
    });
  }
};

// DELETE /api/reservas/:id
const eliminarReserva = async (req, res) => {
  let transaction;

  try {
    const { id } = req.params;

    // Se inicia una transacción para proteger la cancelación de la reserva.
    transaction = await sequelize.transaction();

    const reserva = await Reserva.findByPk(id, { transaction });

    if (!reserva) {
      await transaction.rollback();

      return res.status(404).json({
        estado: 'error',
        mensaje: 'Reserva no encontrada'
      });
    }

    // Eliminación lógica: se cancela la reserva, no se borra físicamente.
    await reserva.update({ estado: 'cancelada' }, { transaction });

    await transaction.commit();

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Reserva cancelada correctamente'
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }

    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al cancelar reserva',
      detalle: error.message
    });
  }
};

// GET /api/reservas/disponibilidad?sala_id=1&fecha=2026-05-05&hora_inicio=10:00&hora_fin=11:00
const consultarDisponibilidad = async (req, res) => {
  try {
    const { sala_id, fecha, hora_inicio, hora_fin } = req.query;

    if (!sala_id || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Sala, fecha, hora de inicio y hora de término son obligatorios'
      });
    }

    const errorHorario = validarHorarioReserva(hora_inicio, hora_fin);

    if (errorHorario) {
      return res.status(400).json({
        estado: 'error',
        mensaje: errorHorario
      });
    }

    const sala = await Sala.findByPk(sala_id);

    if (!sala) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'La sala no existe'
      });
    }

    if (sala.estado !== 'disponible') {
      return res.status(200).json({
        estado: 'ok',
        disponible: false,
        mensaje: 'La sala no se encuentra disponible'
      });
    }

    const conflicto = await existeConflictoReserva({
      sala_id,
      fecha,
      hora_inicio,
      hora_fin
    });

    return res.status(200).json({
      estado: 'ok',
      disponible: !conflicto,
      mensaje: conflicto
        ? 'La sala no está disponible en ese horario'
        : 'La sala está disponible en ese horario'
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al consultar disponibilidad',
      detalle: error.message
    });
  }
};

module.exports = {
  listarReservas,
  obtenerReservaPorId,
  crearReserva,
  actualizarReserva,
  cambiarEstadoReserva,
  eliminarReserva,
  consultarDisponibilidad
};