'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partida extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Partida.belongsTo(models.Juego, {
        foreignKey: 'juegoId'
      })
    }
  };
  Partida.init({
    juegoId: DataTypes.INTEGER,
    fecha: DataTypes.DATE,
    hora: DataTypes.TIME,
    duracion: DataTypes.INTEGER,
    equipo1: DataTypes.STRING,
    equipo2: DataTypes.STRING,
    factor1: DataTypes.FLOAT,
    factor2: DataTypes.FLOAT,
    selector: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Partida',
    freezeTableName: true
  });
  return Partida;
};