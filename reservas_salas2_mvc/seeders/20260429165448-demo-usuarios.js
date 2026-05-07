'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordAdmin = await bcrypt.hash('admin123', 10);
    const passwordUsuario = await bcrypt.hash('usuario123', 10);

    await queryInterface.bulkInsert('usuarios', [
      {
        nombre: 'Administrador Sistema',
        email: 'admin@reservas.cl',
        password: passwordAdmin,
        rol: 'admin',
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Usuario Prueba',
        email: 'usuario@reservas.cl',
        password: passwordUsuario,
        rol: 'usuario',
        estado: 'activo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', {
      email: ['admin@reservas.cl', 'usuario@reservas.cl']
    });
  }
};