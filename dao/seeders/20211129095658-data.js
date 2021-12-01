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
    // Banner
    await queryInterface.bulkInsert('Banner',[
      {nombre:"Champions League",
      imagen:"https://as.com/futbol/imagenes/2019/03/13/champions/1552472334_709181_1552488446_noticia_normal.jpg",
      URL:"https://es.uefa.com/uefachampionsleague/",
      estado: "activo",
      createdAt: new Date(), updatedAt: new Date()
      },
      {nombre:"Libertadores",
      imagen:"https://www.minhatorcida.com.br/imagens/post/10602/capa-ss.jpg",
      URL:"https://www.conmebol.com/es/conmebol-libertadores-2021",
      estado: "activo",
      createdAt: new Date(), updatedAt: new Date()
      },
      {nombre:"Mundial Qatar 2022",
      imagen:"https://www.agenciapi.co/sites/default/files/2021-10/qatar%202022.jpg",
      URL:"https://www.fifa.com/es/tournaments/mens/worldcup/qatar2022",
      estado: "inactivo",
      createdAt: new Date(), updatedAt: new Date()
      }
    ])


    // Categoria
    await queryInterface.bulkInsert('Categoria', [
      {nombre:"Deportes",createdAt: new Date(), updatedAt: new Date()},
      {nombre:"E-Sports",createdAt: new Date(), updatedAt: new Date()}
    ])

    // Juego
    await queryInterface.bulkInsert('Juego', [
      {nombre:"Futbol",categoriaId:1,createdAt: new Date(), updatedAt: new Date()},
      {nombre:"Baloncesto",categoriaId:1,createdAt: new Date(), updatedAt: new Date()},
      {nombre:"Tenis",categoriaId:1,createdAt: new Date(), updatedAt: new Date()},
      {nombre:"Béisbol",categoriaId:1,createdAt: new Date(), updatedAt: new Date()},
      {nombre:"Hockey",categoriaId:1,createdAt: new Date(), updatedAt: new Date()},
      {nombre:"Ping-pon",categoriaId:1,createdAt: new Date(), updatedAt: new Date()}
    ])

    //Partida
    var hoy = new Date;
    var newhora = hoy.getHours() + ':' + hoy.getMinutes();
    await queryInterface.bulkInsert('Partida', [
      {juegoId:1,fecha:new Date(), hora:newhora, duracion:90,
        equipo1:"Peru",equipo2:"Chile",factor1:2,factor2:5,empate:3,
        estado:"Iniciado",resultado:"empate",createdAt: new Date(), updatedAt: new Date()},
      {juegoId:2,fecha:new Date(), hora:newhora, duracion:90,
        equipo1:"Venezuela",equipo2:"Argentina",factor1:3,factor2:1,empate:2,
        estado:"Finalizado",resultado:"empate",createdAt: new Date(), updatedAt: new Date()},
      {juegoId:3,fecha:new Date(), hora:newhora, duracion:90,
        equipo1:"Universitario",equipo2:"Alianza Lima",factor1:2.15,factor2:2.45,empate:2.30,
        estado:"Pendiente",resultado:"empate",createdAt: new Date(), updatedAt: new Date()}
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

    
    //Cliente
    await queryInterface.bulkInsert('Cliente', [
      { 
        nombre:'Jhan Carlos', apellidos:'Mendoza Aylas', dni:'77798438', correo:'20181173@aloe.ulima.edu.pe',
        contrasenia: '$2b$10$jAsJfo1RxWfRXTv2q0xxhu0nEE9/mKFgZcE.6XDxd0n0BvydcEuBi', // 123
        telefono :'987654321', direccion:'Av Las Flores', departamentoId:'1', provinciaId:'1',
        distritoId:1,pep:false,estado:'validado',
        createdAt: new Date(), updatedAt: new Date()
      },
      { 
        nombre:'Luis', apellidos:'Quispe Quispe', dni:'777815438', correo:'luis_quispe@gmail.com',
        contrasenia: '$2b$10$jAsJfo1RxWfRXTv2q0xxhu0nEE9/mKFgZcE.6XDxd0n0BvydcEuBi', // 123
        telefono :'945678249', direccion:'Jr Lampa', departamentoId:'1', provinciaId:'1',
        distritoId:1, pep:false, estado:'pendiente de validación',
        createdAt: new Date(), updatedAt: new Date()
      },
      { 
        nombre:'Miguel', apellidos:'Lopez Ferran', dni:'78434687', correo:'miguelito@gmail.com',
        contrasenia: '$2b$10$jAsJfo1RxWfRXTv2q0xxhu0nEE9/mKFgZcE.6XDxd0n0BvydcEuBi', // 123
        telefono :'975167843', direccion:'Av Larco', departamentoId:'1', provinciaId:'1',
        distritoId:1, pep:true, estado:'dado de baja',
        createdAt: new Date(), updatedAt: new Date()
      },
      { 
        nombre:'Maria', apellidos:'Ortega Paz', dni:'78134597', correo:'maria@gmail.com',
        contrasenia: '$2b$10$jAsJfo1RxWfRXTv2q0xxhu0nEE9/mKFgZcE.6XDxd0n0BvydcEuBi', // 123
        telefono :'979513498', direccion:'Jr Las Casas', departamentoId:'1', provinciaId:'2',
        distritoId:1, pep:true, estado:'validado',
        createdAt: new Date(), updatedAt: new Date()
      }
      
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
