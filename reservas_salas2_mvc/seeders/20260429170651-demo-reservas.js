'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const [usuario] = await queryInterface.sequelize.query(
      "SELECT id FROM usuarios WHERE email = 'usuario@reservas.cl' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    const [sala] = await queryInterface.sequelize.query(
      "SELECT id FROM salas WHERE nombre = 'Sala Reuniones A' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!usuario || !sala) {
      throw new Error('No existen usuarios o salas para crear reservas de prueba');
    }

    await queryInterface.bulkInsert('reservas', [
      {
        usuario_id: usuario.id,
        sala_id: sala.id,
        fecha: '2026-05-05',
        hora_inicio: '09:00:00',
        hora_fin: '10:00:00',
        estado: 'pendiente',
        observacion: 'Reserva de prueba para reunión de coordinación',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        usuario_id: usuario.id,
        sala_id: sala.id,
        fecha: '2026-05-06',
        hora_inicio: '11:00:00',
        hora_fin: '12:00:00',
        estado: 'confirmada',
        observacion: 'Reserva confirmada de prueba',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('reservas', {
      observacion: [
        'Reserva de prueba para reunión de coordinación',
        'Reserva confirmada de prueba'
      ]
    });
  }
};