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

app.get('/', (req, res) => { //Usuario: "Admin" || "Usuario" || "Default"
    if (req.session.username != undefined) {
        req.session.lastLogin = new Date().getTime()
        if (req.session.rol == "Admin") {
            res.redirect('/admin')
        }
        else if(req.session.rol == "Cliente"){
            res.redirect('/cliente')
        } else{
            res.render('Default')
        }
    } else {
        res.render('Default')
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

app.get('/admin', (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_page')
        }
    } else {
        res.redirect('/')
    }
})

app.post("/", async (req, res) => { //contraseña en el primer correo es 123
    const username = req.body.username
    const password = req.body.password
    //const userAdmin = await db.Administrador.findAll({ where: {correo: '20181799@aloe.ulima.edu.pe'} })
    //console.log(userAdmin)
    //const pwAdmin = await db.Administrador.findAll({ where: {contrasenia: '$2b$10$jAsJfo1RxWfRXTv2q0xxhu0nEE9/mKFgZcE.6XDxd0n0BvydcEuBi'} })
    //console.log(pwAdmin)
    //const userClient = await db.Cliente.findAll()
    //const pwClient = await db.Cliente.findAll()
    const FoundUser = 'pw'
    const correctPW = "123"
    const tablename = 'Admin' // Admin || Cliente
    //let passwordhashAdmin = await bcrypt.hash(pwAdmin, saltRounds) //pasar a registro de BD
    //let compareAdmin = await bcrypt.compare(password, passwordhashAdmin)
    //let passwordhashClient = await bcrypt.hash(pwClient, saltRounds) //pasar a registro de BD
    //let compareClient = await bcrypt.compare(password, passwordhashClient)
    let passwordhash = await bcrypt.hash(correctPW, saltRounds)
    let compare = await bcrypt.hash(password, passwordhash)
    /*console.log(username)
    console.log(FoundUser)
    console.log(passwordhash)
    console.log(compare)*/

    if (username == FoundUser && compare) {
        // Login correcto
        req.session.username = username // guardando variable en sesion
        req.session.rol = tablename
        //console.log(0)
        if(tablename == "Admin"){
            return res.redirect('/admin')
            //console.log(1)
        }else{
            return res.redirect('/cliente')
            //console.log(2)
        }
        
    } else {
        /*if (username == FoundUser && compare) {
            // Login correcto
            req.session.username = username // guardando variable en sesion
            req.session.rol = tablename
            console.log(0)
            if(tablename == "Admin"){
                return res.redirect('/admin')
                console.log(1)
            }else{
                return res.redirect('/cliente')
                console.log(2)
            }
            
        } else {
        console.log("contraseña incorrecta123")
        res.render('Default')
        }*/
        console.log("contraseña incorrecta123")
        res.render('Default')
    }
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
                juegoId: te.juegoId,
                juegoNombre: juego.nombre,
                fecha: te.fecha,
                hora: te.hora,
                duracion: te.duracion,
                equipo1: te.equipo1,
                equipo2: te.equipo2,
                factor1: te.factor1,
                factor2: te.factor2,
                resultado: te.resultado
            })
        }
    }

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_partida', {
                partidaLista: NewPartida
            })
        }
    } else {
        res.redirect('/')
    }
})

app.get("/partida/new", async (req, res) => {
    const juegos = await db.Juego.findAll()
    const estados = ["Pendiente","Iniciado","Finalizado"]
    res.render('partida_new',{
        juegos: juegos,
        estados: estados
    })
})


app.post("/partida/new", async (req, res) =>{
    const partidaJuegoId =  req.body.partida_juego_id
    const partidaFecha = req.body.partida_fecha
    const partidaHora = req.body.partida_hora
    const partidaDuracion = req.body.partida_duracion
    const partidaEquipo1 = req.body.partida_equipo1
    const partidaEquipo2 = req.body.partida_equipo2
    const partidaFactor1 = req.body.partida_factor1
    const partidaFactor2 = req.body.partida_factor2
    const partidaResultado = req.body.partida_resultado
    await db.Partida.create({
        juegoId: partidaJuegoId,
        fecha: partidaFecha,
        hora: partidaHora,
        duracion: partidaDuracion,
        equipo1: partidaEquipo1,
        equipo2: partidaEquipo2,
        factor1: partidaFactor1,
        factor2: partidaFactor2,
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
    res.render("Partida_update",{
        partida: partida,
        juegos: juegos,
        estados: estados
    })
})

app.post('/partida/update', async (req, res) =>{
    const partidaid = req.body.partida_id
    const partidaJuegoId =  req.body.partida_juego_id
    const partidaFecha = req.body.partida_fecha
    const partidaHora = req.body.partida_hora
    const partidaDuracion = req.body.partida_duracion
    const partidaEquipo1 = req.body.partida_equipo1
    const partidaEquipo2 = req.body.partida_equipo2
    const partidaFactor1 = req.body.partida_factor1
    const partidaFactor2 = req.body.partida_factor2
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
    partida.factor2= partidaFactor2 
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
    // const aPartidasRegistradas = []
    // if (partida.length > 0) {
    //     for (let te of partida) {
    //         const partida = await te.get()
    //         aPartidasRegistradas.push(partida)
    //     }
    // }

    const juegos = await db.Juego.findAll()
    const estados = ["Pendiente","Iniciado","Finalizado"]
    res.render('Client_partidas', {
        partidaLista: partida,
        estados: estados,
        juegos: juegos
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

// CLIENTES
app.get("/cliente/admin", async (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const cliente = await db.Cliente.findAll()

    const aClienteRegistradas = []
    if (cliente.length > 0) {
        for (let te of cliente) {
            const cliente = await te.get()
            aClienteRegistradas.push(cliente)
        }
    }


    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_cliente', {
                clienteLista: aClienteRegistradas
            })
        }
    } else {
        res.redirect('/')
    }


})


app.get("/juego/admin", (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_juego')
        }
    } else {
        res.redirect('/')
    }
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
            res.render('Categoria_new')
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

app.get("/banner/admin", (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if(req.session.rol != undefined){
    if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.redirect('/')
    }else{
        res.render('Admin_banner')
    }}else{
        res.redirect('/')
    }
})


app.get("/juego/new", (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Juegos_new')
        }
    } else {
        res.redirect('/')
    }
})

app.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

app.listen(PORT, () => {
    console.log(`El servidor inicio correctamente en el puerto ${PORT}`);
})