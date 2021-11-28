'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Partida', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fecha: {
        type: Sequelize.DATE
      },
      hora: {
        type: Sequelize.TIME
      },
      duracion: {
        type: Sequelize.INTEGER
      },
      equipo1: {
        type: Sequelize.STRING
      },
      equipo2: {
        type: Sequelize.STRING
      },
      factor1: {
        type: Sequelize.FLOAT
      },
      factor2: {
        type: Sequelize.FLOAT
      },
      selector: {
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
    await queryInterface.addConstraint('Partida', {
      fields: ['juegoId'],
      type: 'FOREIGN KEY',
      name: 'FK_PARTIDA_JUEGO',
      references: {
        table: 'Juego',
        field: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Partida', 'FK_PARTIDA_JUEGO')
    await queryInterface.dropTable('Partida');
  }
};