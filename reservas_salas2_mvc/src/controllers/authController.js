const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        estado: 'error',
        mensaje: 'El email y la contraseña son obligatorios'
      });
    }

    const usuario = await Usuario.findOne({
      where: { email }
    });

    if (!usuario) {
      return res.status(401).json({
        estado: 'error',
        mensaje: 'Credenciales incorrectas'
      });
    }

    if (usuario.estado !== 'activo') {
      return res.status(403).json({
        estado: 'error',
        mensaje: 'El usuario se encuentra inactivo'
      });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        estado: 'error',
        mensaje: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
      }
    );

    return res.status(200).json({
      estado: 'ok',
      mensaje: 'Login correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    return res.status(500).json({
      estado: 'error',
      mensaje: 'Error interno al iniciar sesión',
      detalle: error.message
    });
  }
};

module.exports = {
  login
};