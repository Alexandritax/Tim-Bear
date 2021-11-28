'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apuesta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Apuesta.belongsTo(models.Partida, {
        foreignKey: 'partidaId'
      })
      Apuesta.belongsTo(models.Cliente, {
        foreignKey: 'clienteId'
      })
    }
  };
  Apuesta.init({
    partidaId: DataTypes.INTEGER,
    clienteId: DataTypes.INTEGER,
    monto: DataTypes.FLOAT,
    ganancia: DataTypes.FLOAT,
    ganador: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Apuesta',
    freezeTableName: true
  });
  return Apuesta;
};