'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Provincia', {
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
    await queryInterface.addConstraint('Provincia', {
      fields: ['departamentoId'],
      type: 'FOREIGN KEY',
      name: 'FK_PROVINCIA_DEPARTAMENTO',
      references: {
        table: 'Departamento',
        field: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Provincia', 'FK_PROVINCIA_DEPARTAMENTO')
    await queryInterface.dropTable('Provincia');
  }
};