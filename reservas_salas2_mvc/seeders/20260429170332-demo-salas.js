
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('salas', [
      {
        nombre: 'Sala Reuniones A',
        capacidad: 10,
        ubicacion: 'Primer piso',
        estado: 'disponible',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Sala Capacitación B',
        capacidad: 25,
        ubicacion: 'Segundo piso',
        estado: 'disponible',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Auditorio Principal',
        capacidad: 80,
        ubicacion: 'Edificio Central',
        estado: 'mantencion',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('salas', {
      nombre: [
        'Sala Reuniones A',
        'Sala Capacitación B',
        'Auditorio Principal'
      ]
    });
  }
};