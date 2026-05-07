module.exports = (sequelize, DataTypes) => {
  const Sala = sequelize.define(
    'Sala',
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El nombre de la sala es obligatorio'
          }
        }
      },
      capacidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1],
            msg: 'La capacidad debe ser mayor a 0'
          },
          isInt: {
            msg: 'La capacidad debe ser un número entero'
          }
        }
      },
      ubicacion: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La ubicación es obligatoria'
          }
        }
      },
      estado: {
        type: DataTypes.ENUM('disponible', 'no_disponible', 'mantencion'),
        allowNull: false,
        defaultValue: 'disponible'
      }
    },
    {
      tableName: 'salas'
    }
  );

  Sala.associate = (models) => {
    Sala.hasMany(models.Reserva, {
      foreignKey: 'sala_id',
      as: 'reservas'
    });
  };

  return Sala;
};