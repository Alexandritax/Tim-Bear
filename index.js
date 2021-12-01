

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require('bcrypt');
const db = require('./dao/models');
const { render } = require('ejs');
const saltRounds = 10

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(express.static('assets')) // soporte de archivos estaticos
app.set('view engine', 'ejs') // Configuramos el motor de templates
app.use(session({
    secret: "daleu",
    resave: false,
    saveUninitialized: false
}))

app.get('/', async (req, res) => { //Usuario: "Admin" || "Usuario" || "Default"
    const banners = await db.Banner.findAll({
        where: {
            estado:"activo"
        },
        order : [
            ['id', 'ASC']
        ]
    })

    if (req.session.username != undefined) {
        req.session.lastLogin = new Date().getTime()
        if (req.session.rol == "Admin") {
            res.redirect('/admin')
        }
        else if(req.session.rol == "Cliente"){
            res.redirect('/cliente')
        } else{
            res.render('Default',{
                LogFlag: 0,
                banners: banners
            })
        }
    } else {
        res.render('Default',{
            LogFlag: 0,
            banners: banners
        })
    }

})

app.get('/reglas', (req, res) => {
    res.render('reglas')
})

app.get('/terminos', (req, res) => {
    res.render('terminos')
})

app.get('/nosotros', (req, res) => {
    res.render('nosotros')
})

app.get('/cliente', (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Client_page')
        }
    } else {
        res.redirect('/')
    }
})

app.get('/cliente/nuevo', async (req, res) => {
    const distritos = await db.Distrito.findAll()
    const provincias = await db.Provincia.findAll()
    const departamentos = await db.Departamento.findAll()

    res.render('Client_new', {
        distritos: distritos,
        provincias: provincias,
        departamentos: departamentos
    })
})

app.post('/cliente/nuevo', async (req, res) => {
    req.body.cliente_pep = Boolean(req.body.cliente_pep)
    const clienteNombre = req.body.cliente_nombre
    const clienteApellidos = req.body.cliente_apellidos
    const clienteDNI = req.body.cliente_dni
    const clienteFoto = req.body.cliente_foto
    const clienteCorreo = req.body.cliente_correo
    const clienteContrasenia = req.body.cliente_contrasenia
    const clienteContrasenia2 = req.body.cliente_contrasenia2
    const clienteTelefono = req.body.cliente_telefono
    const clienteDireccion = req.body.cliente_direccion
    const clienteDepartamentoId = req.body.cliente_departamento_id
    const clienteProvinciaId = req.body.cliente_provincia_id
    const clienteDistritoId = req.body.cliente_distrito_id
    const clientePEP = req.body.cliente_pep

    let passwordhash = await bcrypt.hash(clienteContrasenia, saltRounds)

    if (clienteContrasenia != clienteContrasenia2) {
        console.log("contraseña incorrecta")
        res.redirect('/cliente/nuevo')
    }else{
        await db.Cliente.create({
            nombre: clienteNombre,
            apellidos: clienteApellidos,
            dni: clienteDNI,
            imagen_url: clienteFoto,
            correo: clienteCorreo,
            contrasenia: passwordhash,
            telefono: clienteTelefono,
            direccion: clienteDireccion,
            departamentoId: clienteDepartamentoId,
            provinciaId: clienteProvinciaId,
            distritoId: clienteDistritoId,
            pep: clientePEP,
            estado: "pendiente de validación"
        })
        // Login correcto
        req.session.clienteCorreo = clienteCorreo // guardando variable en sesion
        req.session.rol = "Cliente"
        res.redirect('/cliente/validacion')
    }
})

app.get('/cliente/validacion', (req, res) => {
    res.render('Client_wait')
})

app.get('/cliente/modificar/:codigo', async (req, res) => {
    const idCliente = req.params.codigo

    const cliente = await db.Cliente.findOne({
        where : {
            id : idCliente
        }
    })

    res.render('Client_update', {
        cliente : cliente,
    })
})

app.post('/cliente/modificar', async (req, res) => {
    const idCliente = req.body.cliente_id
    const estado = req.body.estado

    const cliente = await db.Torneo.findOne({
        where : {
            id : idCliente
        }
    })
 
    cliente.estado = estado

    await cliente.save()

    res.redirect('/cliente/admin')

})

app.get('/admin', async (req, res) => {
    
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin
    const banners = await db.Banner.findAll({
        where: {
            estado:"activo"
        },
        order : [
            ['id', 'ASC']
        ]
    })
    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_page',{
                user:req.session.username,
                banners: banners
            })
        }
    } else {
        res.redirect('/')
    }
})

app.post("/", async (req, res) => { //contraseña en el primer correo es 123
    async function findUser(correo) {
            const administrator = await db.Administrador.findOne({where:{
            correo: correo
        }})
            const cliente = await db.Cliente.findOne({where:{
            correo: correo
        }})
        if(administrator == null && cliente != null){
            return cliente
        }
        else if(cliente == null && administrator != null){
            return administrator
        }else if(cliente != null && administrator != null){
            return administrator
        }else{
            return "NonUser"
        }
    }

    async function findUserType(correo) {
        const administrator = await db.Administrador.findOne({where:{
            correo: correo
        }})
        const cliente = await db.Cliente.findOne({where:{
            correo: correo
        }})
        if(administrator == null && cliente != null){
            return "Cliente"
        }
        else if(cliente == null && administrator != null){
            return "Admin"
        }
        else if(cliente != null && administrator != null){
            return "Admin"
        }
        else{
            return "NonUser"
        }
    }

    async function pageload(user,secret) {
        const FoundUser = await findUser(user)
        const tablename = await findUserType(user)
        if(user==FoundUser.correo) {
            let compare = bcrypt.compareSync(secret, FoundUser.contrasenia)
            if (compare) {
            // Login correcto
            
            //console.log(0)
            if(tablename == "Admin"){
                req.session.username = user // guardando variable en sesion
                req.session.rol = tablename
                res.redirect('/admin')
                //console.log(1)
            }else if(tablename == "Cliente"){
                req.session.username = user // guardando variable en sesion
                req.session.rol = tablename
                res.redirect('/cliente')
                //console.log(2)
            }else{
                res.render('Default',{
                    LogFlag: 2,
                    banners: banners
                })
            }
            
        }else{
            console.log("contraseña incorrecta")
            res.render('Default',{
                LogFlag: 1,
                banners: banners
            })
        } 
        }else{
            console.log('Usuario no existente')
            res.render('Default',{
                LogFlag: 3,
                banners: banners
            })
        }
    }

    const username = req.body.username
    const password = req.body.password

    pageload(username,password)

})

// PARTIDAS
app.get("/partida/admin", async (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const partida = await db.Partida.findAll()
    const NewPartida = []
    if (partida.length > 0) {
        for (let te of partida) {
            const juego = await te.getJuego()
            NewPartida.push({
                id:te.id,
                juegoId: te.juegoId,
                juegoNombre: juego.nombre,
                fecha: te.fecha,
                hora: te.hora,
                duracion: te.duracion,
                equipo1: te.equipo1,
                empate: te.empate,
                equipo2: te.equipo2,
                factor1: te.factor1,
                factor2: te.factor2,
                estado: te.estado,
                resultado: te.resultado
            })
        }
    }
    const estados = ["Pendiente","Iniciado","Finalizado"]

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_partida', {
                user:req.session.username,
                partidaLista: NewPartida,
                estados: estados
            })
        }
    } else {
        res.redirect('/')
    }
})

//Filtro

app.get("/partida/search", async (req, res)=> {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const filtro = req.query.estado
    const partida = await db.Partida.findAll({where:{estado:filtro}})
    const NewPartida = []
    if (partida.length > 0) {
        for (let te of partida) {
            const juego = await te.getJuego()
            NewPartida.push({
                id:te.id,
                juegoId: te.juegoId,
                juegoNombre: juego.nombre,
                fecha: te.fecha,
                hora: te.hora,
                duracion: te.duracion,
                equipo1: te.equipo1,
                empate: te.empate,
                equipo2: te.equipo2,
                factor1: te.factor1,
                factor2: te.factor2,
                estado: te.estado,
                resultado: te.resultado
            })
        }
    }
    const estados = ["Pendiente","Iniciado","Finalizado"]

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_partida', {
                user:req.session.username,
                partidaLista: NewPartida,
                estados: estados
            })
        }
    } else {
        res.redirect('/')
    }
})

app.get("/partida/new", async (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const juegos = await db.Juego.findAll()
    const estados = ["Pendiente","Iniciado","Finalizado"]
    const resultados = ["pendiente","equipo1","empate","equipo2"]

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('partida_new',{
                juegos: juegos,
                estados: estados,
                resultados: resultados
            })
        }
    } else {
        res.redirect('/')
    }


    
})


app.post("/partida/new", async (req, res) =>{
    const partidaJuegoId =  req.body.partida_juego_id
    const partidaFecha = req.body.partida_fecha
    const partidaHora = req.body.partida_hora
    const partidaDuracion = req.body.partida_duracion
    const partidaEquipo1 = req.body.partida_equipo1
    const partidaEmpate = req.body.partida_empate
    const partidaEquipo2 = req.body.partida_equipo2
    const partidaFactor1 = req.body.partida_factor1
    const partidaFactor2 = req.body.partida_factor2
    const partidaEstado = req.body.partida_estado
    var partidaResultado = req.body.partida_resultado
    if(partidaResultado == undefined){
        partidaResultado = "pendiente"
    }
    await db.Partida.create({
        juegoId: partidaJuegoId,
        fecha: partidaFecha,
        hora: partidaHora,
        duracion: partidaDuracion,
        equipo1: partidaEquipo1,
        equipo2: partidaEquipo2,
        factor1: partidaFactor1,
        empate: partidaEmpate,
        factor2: partidaFactor2,
        estado: partidaEstado,
        resultado: partidaResultado
    })
    res.redirect("/partida/admin")
})


app.get("/partida/update/:id", async (req, res) => {
    const partidaid = req.params.id

    const partida = await db.Partida.findOne({
        where : {
            id : partidaid
        }
    })
    const juegos = await db.Juego.findAll()
    const estados = ["Pendiente","Iniciado","Finalizado"]
    const resultados = ["pendiente","equipo1","empate","equipo2"]
    res.render("Partida_update",{
        partida: partida,
        juegos: juegos,
        estados: estados,
        resultados: resultados
    })
})

app.post('/partida/update', async (req, res) =>{
    const partidaid = req.body.partida_id
    const partidaJuegoId =  req.body.partida_juego_id
    const partidaFecha = req.body.partida_fecha
    const partidaHora = req.body.partida_hora
    const partidaDuracion = req.body.partida_duracion
    const partidaEquipo1 = req.body.partida_equipo1
    const partidaEmpate = req.body.partida_empate
    const partidaEquipo2 = req.body.partida_equipo2
    const partidaFactor1 = req.body.partida_factor1
    const partidaFactor2 = req.body.partida_factor2
    const partidaEstado = req.body.partida_estado
    const partidaResultado = req.body.partida_resultado

    const partida = await db.Partida.findOne({
        where : {
            id : partidaid
        }
    })

    partida.juegoId= partidaJuegoId 
    partida.fecha= partidaFecha 
    partida.hora= partidaHora 
    partida.duracion= partidaDuracion 
    partida.equipo1= partidaEquipo1 
    partida.equipo2= partidaEquipo2 
    partida.factor1= partidaFactor1
    partida.empate= partidaEmpate 
    partida.factor2= partidaFactor2
    partida.estado = partidaEstado 
    partida.resultado= partidaResultado 

    await partida.save()

    res.redirect("/partida/admin")

})

app.get("/partida/delete/:id", async (req, res) => {
    const idPartida = req.params.id
    await db.Partida.destroy({
        where: {id: idPartida}
    })
    res.redirect("/partida/admin")
})

// PARTIDAS GENERAL PARA TODOS
app.get("/partida", async (req, res) => {
    const partida = await db.Partida.findAll()
    const juegos = await db.Juego.findAll()
    const categoria = await db.Categoria.findAll()
    const banners = await db.Banner.findAll({
        order : [
            ['id', 'ASC']
        ]
    })
    const estados = ["Pendiente","Iniciado","Finalizado"]
    res.render('Client_partidas', {
        partidaLista: partida,
        estados: estados,
        juegos: juegos,
        banners: banners ,
        categoria : categoria

    })
    
})

// PARTIDA FILTRO POR JUEGO

app.get('/partida/juego/:id', async(req,res)=>{

    const juegoid = req.params.id
    const juegos= await db.Juego.findAll();
    const categorias= await db.Categoria.findAll()
    const banners = await db.Banner.findAll({
        order : [
            ['id', 'ASC']
        ]
    })
    const partidas=await db.Partida.findAll({
        where: {
            juegoId: juegoid
        }
    })
    res.render('client_partidas', {
        partidaLista : partidas,
        categoria: categorias,
        banners: banners ,
        juegos : juegos
    })
})

//PARTIDA FILTRO POR CATEGORIA

app.get('/partida/categoria/:id', async(req,res)=>{

    const categoriaid = req.params.id
    const categorias=await db.Categoria.findAll()
    const partidas = await db.Partida.findAll()
    const banners = await db.Banner.findAll({
        order : [
            ['id', 'ASC']
        ]
    })
    const juegos=await db.Juego.findAll({
        where: {
            categoriaId: categoriaid
        }
    })
    res.render('client_partidas', {
        partidaLista : partidas,
        categoria: categorias,
        banners: banners ,
        juegos : juegos
    })
})






// ESTO CREO QUE LO HIZO RODRIGO NO FUNCIONA PERO NO LO BORRO
app.get("/partidasss", async (req, res) => {

    if (Object.keys(req.query).length > 0) {
        console.log(req.query);
        const juego = await db.Juego.findByPk(req.query.juegoId);
        console.log(req.query.juegoId)
        const partidas = await db.Partida.findAll({
            where: { juegoId: req.query.juegoId },
        })
        res.render("Client_partidas", { partidaLista: partidas, juego:juego });
    }else{
    res.redirect('/partida');
    }
});


//HASTA ACÁ CHECA BIEN ESO SI NO SIRVE LO ELIMINAS

// CLIENTES ADMIN
app.get("/admin/cliente", async (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const cliente = await db.Cliente.findAll({
        order : [ 
            ['id','ASC'] 
        ]
    });

    const aClienteRegistradas = []
    if (cliente.length > 0) {
        for (let te of cliente) {
            const user = await te.get()
            aClienteRegistradas.push(user)
        }
    }


    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_cliente', {
                user:req.session.username,
                clienteLista: aClienteRegistradas
            })
        }
    } else {
        res.redirect('/')
    }


})

//CLIENTES ADMIN FILTRAR
app.get('/admin/cliente/filtrar', async (req, res) => { 

    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const Filtro = req.query.filtros;
    const clientes = await db.Cliente.findAll();

    const aClienteRegistradas = [];

    clientes.forEach( (cliente)=> {
        if( cliente.dni.includes(Filtro) || cliente.nombre.includes(Filtro) ||
        cliente.apellidos.includes(Filtro) || 
        cliente.correo.includes(Filtro))
        {
            aClienteRegistradas.push(cliente);
        }
    })

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_cliente_filtrado',{
                user:req.session.username,
                clienteLista : aClienteRegistradas,
                filtros : Filtro,})
            }}
    else {
        res.redirect('/')
    }
})







//Juegos

app.get("/juego/admin", async (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const juegos = await db.Juego.findAll()
    const NewJuego = []
    if (juegos.length > 0) {
        for (let te of juegos) {
            const categoria = await db.Categoria.findOne({where:{id:te.categoriaId}})
            NewJuego.push({
                id: te.id,
                nombre: te.nombre,
                categoriaId: te.categoriaId,
                categoriaNombre: categoria.nombre
            })
        }
    }


    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_juego',{
                user:req.session.username,
                juegos: NewJuego
            })
        }
    } else {
        res.redirect('/')
    }
})

app.get("/juego/new", async (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const juegos = await db.Juego.findAll()
    const categorias = await db.Categoria.findAll()

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Juegos_new',{
                juegos: juegos,
                categorias: categorias
            })
        }
    } else {
        res.redirect('/')
    }
})

app.post("/juego/new", async (req, res) => {
    const juegoNombre = req.body.juego_nombre
    const juegoCategoria = req.body.juegocategoria_id

    await db.Juego.create({
        nombre: juegoNombre,
        categoriaId: juegoCategoria
    })
    res.redirect('/juego/admin')
})

app.get("/juego/update/:id", async (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const idJuego = req.params.id

    const juego = await db.Juego.findOne({where:{id:idJuego}})
    const categorias = await db.Categoria.findAll()

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Juegos_update',{
                juego: juego,
                categorias: categorias
            })
        }
    } else {
        res.redirect('/')
    }
})

app.post("/juego/update/", async (req, res) => {
    const juegoId = req.body.juegocategoria_id
    const juegoNombre = req.body.juego_nombre
    const juegoCategoria = req.body.juegocategoria_id

    const juego = await db.Juego.findOne({where:{id:juegoId}})

    juego.nombre = juegoNombre
    juego.categoriaId = juegoCategoria

    await juego.save()

    res.redirect('/juego/admin')

})

app.get("/juego/delete/:id", async (req, res) => {
    const juegoId = req.params.id

    await db.Juego.destroy({
        where: {
            id: juegoId
        }
    })

    res.redirect("/juego/admin")
})
//BANNERS
app.get("/banner/admin",async (req,res)=>{
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin
    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            //Obtener categorias de la base de datos
            const banners = await db.Banner.findAll({
                
                order : [
                    ['id', 'ASC']
                ]
            })
            res.render('Admin_banner',{
                user:req.session.username,
                banners :banners
            })
        }
    } else {
        res.redirect('/')
    }
})



app.get("/banner/admin/modificar/:codigo",async(req,res)=>{

    const idBanner = req.params.codigo
    const banner = await db.Banner.findOne({
        where: {
            id : idBanner
        }
    })
    res.render('Banners_update',{
        user:req.session.username,
        banner : banner
    })

})

app.post("/banner/admin/modificar",async(req,res)=>{
    const idBanner = req.body.banner_id
    const nombre = req.body.banner_nombre
    const imagen = req.body.banner_imagen 
    const url = req.body.banner_url
    const estado = req.body.banner_estado

    const banner = await db.Banner.findOne({
        where : {
            id : idBanner
        }
    })
    banner.nombre = nombre
    banner.imagen = imagen
    banner.URL = url
    banner.estado = estado

    await banner.save()
    res.redirect('/banner/admin')

})

app.get("/banner/admin/new",(req,res)=>{
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin
    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Banners_new',{
                user:req.session.username
            })
        }
    } else {
        res.redirect('/')
    }
})

app.post("/banner/admin/new",async(req,res)=>{
    
    const bannerNombre = req.body.banner_nombre
    const bannerImagen = req.body.banner_imagen 
    const bannerurl = req.body.banner_url
    const bannerestado = req.body.banner_estado

    await db.Banner.create({
        nombre : bannerNombre,
        imagen : bannerImagen,
        URL : bannerurl,
        estado : bannerestado
    })
    res.redirect('/banner/admin')
})


// CATEGORIAS
app.get("/categoria/admin",async (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            //Obtener categorias de la base de datos
            const categorias = await db.Categoria.findAll({
                order : [
                    ['id', 'ASC']
                ]
            });
            res.render('Admin_categoria',{
                user:req.session.username,
                categorias :categorias
            })
        }
    } else {
        res.redirect('/')
    }

})
//Mostrar formularios categoria
app.get("/categoria/admin/new",(req,res) =>{
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Categoria_new',{
                user:req.session.username
            })
        }
    } else {
        res.redirect('/')
    }
})
//Guardar datos del formulario nueva categoria
app.post("/categoria/admin/new", async (req,res)=>{
    const categoriaNombre = req.body.categoria_nombre

    await db.Categoria.create({
        nombre : categoriaNombre
    })
    res.redirect('/categoria/admin')
})

app.get("/categoria/admin/modificar/:codigo",async (req,res)=>{
    const idCategoria = req.params.codigo
    const categoria = await db.Categoria.findOne({
        where: {
            id : idCategoria
        }
    })
    res.render('Categoria_update',{
        user:req.session.username,
        categoria : categoria
    })

})

app.post("/categoria/admin/modificar",async(req,res)=>{
    const idCategoria = req.body.categoria_id
    const nombre = req.body.categoria_nombre

    const categoria = await db.Categoria.findOne({
        where : {
            id : idCategoria
        }
    })
    categoria.nombre = nombre

    await categoria.save()
    res.redirect('/categoria/admin')
})

app.get("/categoria/admin/eliminar/:codigo", async(req,res)=>{
    const idCategoria = req.params.codigo
    await db.Categoria.destroy({
        where : {
            id : idCategoria
        }
    })
    res.redirect('/categoria/admin')
})



app.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

app.listen(PORT, () => {
    console.log(`El servidor inicio correctamente en el puerto ${PORT}`);
})