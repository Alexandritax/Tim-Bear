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
   //
   
    //Administrador
    await queryInterface.bulkInsert('Administrador', [
      { 
        correo: '20181799@aloe.ulima.edu.pe',
        contrasenia: '$2b$10$jAsJfo1RxWfRXTv2q0xxhu0nEE9/mKFgZcE.6XDxd0n0BvydcEuBi', // 123
        createdAt: new Date(), updatedAt: new Date()
      }
    ])
    // Categoria
    await queryInterface.bulkInsert('Categoria', [
      {nombre:"Finales",createdAt: new Date(), updatedAt: new Date()},
      {nombre:"Seleccion",createdAt: new Date(), updatedAt: new Date()}
    ])

    // Juego
    await queryInterface.bulkInsert('Juego', [
      {nombre:"Futbol",categoriaId:1,createdAt: new Date(), updatedAt: new Date()},
      {nombre:"Baloncesto",categoriaId:1,createdAt: new Date(), updatedAt: new Date()},
      {nombre:"Volleyball",categoriaId:1,createdAt: new Date(), updatedAt: new Date()}
    ])

    //Partida
    var hoy = new Date;
    var newhora = hoy.getHours() + ':' + hoy.getMinutes();
    await queryInterface.bulkInsert('Partida', [
      {juegoId:1,fecha:new Date(), hora:newhora, duracion:90,
        equipo1:"Peru",equipo2:"Chile",factor1:2,factor2:5,
        resultado:"iniciado",createdAt: new Date(), updatedAt: new Date()},
      {juegoId:2,fecha:new Date(), hora:newhora, duracion:90,
        equipo1:"Venezuela",equipo2:"Argentina",factor1:3,factor2:1,
        resultado:"iniciado",createdAt: new Date(), updatedAt: new Date()}
    ])

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
    await queryInterface.bulkDelete('Categoria', null, {})
    await queryInterface.bulkDelete('Juego', null, {})
    await queryInterface.bulkDelete('Partida', null, {})
    await queryInterface.bulkDelete('Distrito', null, {})
    await queryInterface.bulkDelete('Provincia', null, {})
    await queryInterface.bulkDelete('Departamento', null, {})
    await queryInterface.bulkDelete('Categoria', null, {})
  }
};
