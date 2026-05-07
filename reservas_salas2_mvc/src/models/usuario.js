module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    'Usuario',
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'El nombre es obligatorio'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'El correo ya está registrado'
        },
        validate: {
          isEmail: {
            msg: 'Debe ingresar un correo válido'
          },
          notEmpty: {
            msg: 'El correo es obligatorio'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'La contraseña es obligatoria'
          }
        }
      },
      rol: {
        type: DataTypes.ENUM('admin', 'usuario'),
        allowNull: false,
        defaultValue: 'usuario'
      },
      estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        allowNull: false,
        defaultValue: 'activo'
      }
    },
    {
      tableName: 'usuarios'
    }
  );

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Reserva, {
      foreignKey: 'usuario_id',
      as: 'reservas'
    });
  };

  return Usuario;
};