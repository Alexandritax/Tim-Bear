'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    // Administrador

    // Departamento
    await queryInterface.bulkInsert('Departamento', [
      {nombre: "Lima", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Ica", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Loreto", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Arequipa", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Pasco", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Puno", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Junin", createdAt: new Date(), updatedAt: new Date()},
    ])

    // Provincia
    await queryInterface.bulkInsert('Provincia', [
      {nombre: "Lima", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Yauyos", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Nazca", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Maynas", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Loreto", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Cañete", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Oyon", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Camana", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Pasco", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Lampa", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Tarma", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Jauja", createdAt: new Date(), updatedAt: new Date()},
    ])

    // Distrito
    await queryInterface.bulkInsert('Distrito', [
      {nombre: "Lima", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Lurin", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Miraflores", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Nazca", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Lurin", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Nauta", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Nuevo Imperial", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Navan", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Nicolas de Pierola", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Ninacaca", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Nicasio", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Palca", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Palcamayo", createdAt: new Date(), updatedAt: new Date()},
      {nombre: "Pancan", createdAt: new Date(), updatedAt: new Date()},
    ])
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Distrito', null, {})
    await queryInterface.bulkDelete('Provincia', null, {})
    await queryInterface.bulkDelete('Departamento', null, {})
  }
};
