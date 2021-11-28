'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Administrador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Administrador.init({
    correo: DataTypes.STRING,
    contrasenia: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Administrador',
    freezeTableName: true
  });
  return Administrador;
};