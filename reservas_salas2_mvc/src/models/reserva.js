module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define(
    'Reserva',
    {
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        validate: {
          notNull: {
            msg: 'El usuario es obligatorio'
          }
        }
      },
      sala_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'salas',
          key: 'id'
        },
        validate: {
          notNull: {
            msg: 'La sala es obligatoria'
          }
        }
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: {
            msg: 'La fecha debe tener un formato válido'
          },
          notNull: {
            msg: 'La fecha es obligatoria'
          }
        }
      },
      hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'La hora de inicio es obligatoria'
          }
        }
      },
      hora_fin: {
        type: DataTypes.TIME,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'La hora de término es obligatoria'
          }
        }
      },
      estado: {
        type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'finalizada'),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      observacion: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'reservas'
    }
  );

  Reserva.associate = (models) => {
    Reserva.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario'
    });

    Reserva.belongsTo(models.Sala, {
      foreignKey: 'sala_id',
      as: 'sala'
    });
  };

  return Reserva;
};