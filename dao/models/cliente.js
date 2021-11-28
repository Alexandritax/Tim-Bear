'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cliente.belongsTo(models.Distrito, {
        foreignKey: 'distritoId'
      })
    }
  };
  Cliente.init({
    nombre: DataTypes.STRING,
    apellidos: DataTypes.STRING,
    dni: DataTypes.STRING,
    imagen_url: DataTypes.STRING,
    correo: DataTypes.STRING,
    contrasenia: DataTypes.STRING,
    telefono: DataTypes.STRING,
    direccion: DataTypes.STRING,
    distritoId: DataTypes.INTEGER,
    pep: DataTypes.BOOLEAN,
    estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cliente',
    freezeTableName: true
  });
  return Cliente;
};