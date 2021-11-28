'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Apuesta', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      monto: {
        type: Sequelize.FLOAT
      },
      ganancia: {
        type: Sequelize.FLOAT
      },
      ganador: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.addConstraint('Apuesta', {
      fields: ['partidaId'],
      type: 'FOREIGN KEY',
      name: 'FK_APUESTA_PARTIDA',
      references: {
        table: 'Partida',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('Apuesta', {
      fields: ['clienteId'],
      type: 'FOREIGN KEY',
      name: 'FK_APUESTA_CLIENTE',
      references: {
        table: 'Cliente',
        field: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Apuesta', 'FK_APUESTA_CLIENTE')
    await queryInterface.dropTable('Apuesta');
  }
};