'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Distrito', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
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
    await queryInterface.addConstraint('Distrito', {
      fields: ['provinciaId'],
      type: 'FOREIGN KEY',
      name: 'FK_DISTRITO_PROVINCIA',
      references: {
        table: 'Provincia',
        field: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Distrito', 'FK_DISTRITO_PROVINCIA')
    await queryInterface.dropTable('Distrito');
  }
};