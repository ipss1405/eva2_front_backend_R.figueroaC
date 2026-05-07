const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

// GET /api/usuarios
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'estado', 'createdAt', 'updatedAt'],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Usuarios listados correctamente',
      data: usuarios
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al listar usuarios',
      detalle: error.message
    });
  }
};

// GET /api/usuarios/:id
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'estado', 'createdAt', 'updatedAt']
    });

    if (!usuario) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'Usuario no encontrado'
      });
    }

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Usuario encontrado',
      data: usuario
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al obtener usuario',
      detalle: error.message
    });
  }
};

// POST /api/usuarios
const crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Nombre, email y contraseña son obligatorios'
      });
    }

    const usuarioExistente = await Usuario.findOne({
      where: { email }
    });

    if (usuarioExistente) {
      return res.status(409).json({
        estado: 'error',
        mensaje: 'El correo ya está registrado'
      });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: passwordEncriptada,
      rol: rol || 'usuario',
      estado: 'activo'
    });

    return res.status(201).json({
      estado: 'ok',
      mensaje: 'Usuario creado correctamente',
      data: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
        estado: nuevoUsuario.estado
      }
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al crear usuario',
      detalle: error.message
    });
  }
};

// PUT /api/usuarios/:id
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'Usuario no encontrado'
      });
    }

    if (!nombre || !email) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Nombre y email son obligatorios'
      });
    }

    let passwordActualizada = usuario.password;

    if (password) {
      passwordActualizada = await bcrypt.hash(password, 10);
    }

    await usuario.update({
      nombre,
      email,
      password: passwordActualizada,
      rol: rol || usuario.rol
    });

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Usuario actualizado correctamente',
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado
      }
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al actualizar usuario',
      detalle: error.message
    });
  }
};

// PATCH /api/usuarios/:id/estado
const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosPermitidos = ['activo', 'inactivo'];

    if (!estado || !estadosPermitidos.includes(estado)) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'Estado inválido. Use activo o inactivo'
      });
    }

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'Usuario no encontrado'
      });
    }

    await usuario.update({ estado });

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Estado del usuario actualizado correctamente',
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        estado: usuario.estado
      }
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al cambiar estado del usuario',
      detalle: error.message
    });
  }
};

// DELETE /api/usuarios/:id
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        estado: 'error',
        mensaje: 'Usuario no encontrado'
      });
    }

    // Eliminación lógica: no borra físicamente, solo deja inactivo.
    await usuario.update({ estado: 'inactivo' });

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Usuario eliminado lógicamente correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error al eliminar usuario',
      detalle: error.message
    });
  }
};

module.exports = {
  listarUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario
};
