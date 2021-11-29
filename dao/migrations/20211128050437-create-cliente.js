'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Cliente', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      apellidos: {
        type: Sequelize.STRING
      },
      dni: {
        type: Sequelize.STRING
      },
      imagen_url: {
        type: Sequelize.STRING
      },
      correo: {
        type: Sequelize.STRING
      },
      contrasenia: {
        type: Sequelize.STRING
      },
      telefono: {
        type: Sequelize.STRING
      },
      direccion: {
        type: Sequelize.STRING
      },
      departamentoId: {
        type: Sequelize.INTEGER
      },
      provinciaId: {
        type: Sequelize.INTEGER
      },
      distritoId: {
        type: Sequelize.INTEGER
      },
      pep: {
        type: Sequelize.BOOLEAN
      },
      estado: {
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
    await queryInterface.addConstraint('Cliente', {
      fields: ['departamentoId'],
      type: 'FOREIGN KEY',
      name: 'FK_CLIENTE_DEPARTAMENTO',
      references: {
        table: 'Departamento',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('Cliente', {
      fields: ['provinciaId'],
      type: 'FOREIGN KEY',
      name: 'FK_CLIENTE_PROVINCIA',
      references: {
        table: 'Provincia',
        field: 'id'
      }
    })
    await queryInterface.addConstraint('Cliente', {
      fields: ['distritoId'],
      type: 'FOREIGN KEY',
      name: 'FK_CLIENTE_DISTRITO',
      references: {
        table: 'Distrito',
        field: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Cliente', 'FK_CLIENTE_DEPARTAMENTO')
    await queryInterface.removeConstraint('Cliente', 'FK_CLIENTE_PROVINCIA')
    await queryInterface.removeConstraint('Cliente', 'FK_CLIENTE_DISTRITO')
    await queryInterface.dropTable('Cliente');
  }
};