const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require('bcrypt');
const db = require('./dao/models');
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
    const FoundUser = 'pw'
    const correctPW = "123"
    const tablename = 'Admin' // Admin || Cliente
    let passwordhash = await bcrypt.hash(correctPW, saltRounds) //pasar a registro de BD
    let compare = await bcrypt.compare(password, passwordhash)


    if (username == FoundUser && compare) {
        // Login correcto
        req.session.username = username // guardando variable en sesion
        req.session.rol = tablename
        if(tablename == "Admin"){
            res.redirect('/admin')
        }else{
            res.redirect('/cliente')
        }
        
    } else {
        console.log("contraseña incorrecta123")
        res.render('Default')
    }
})

// PARTIDAS
app.get("/partida/admin", async (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    const partida = await db.Partida.findAll()
    const aPartidasRegistradas = []
    if (partida.length > 0) {
        for (let te of partida) {
            const partida = await te.get()
            aPartidasRegistradas.push(partida)
        }
    }
    console.log(aPartidasRegistradas)


    if (req.session.rol != undefined) {
        if (dif >= 3 * 60 * 60 * 1000) {
            req.session.destroy() // Destruyes la sesion
            res.redirect('/')
        } else {
            res.render('Admin_partida', {
                partidaLista: aPartidasRegistradas
            })
        }
    } else {
        res.redirect('/')
    }
})

app.get("/partidas", async (req, res) => {
    let juego = null;
    let partidas = null;
    if (Object.keys(req.query).length > 0) {
        console.log(req.query);
        juego = await db.Juego.findByPk(req.query.juegoId);
        partidas = await db.Partida.findAll({
            where: { juegoId: Number(req.query.juegoId) },
        });
    }
    res.render("Client_partidas", { partidas, juego });
});

app.get("/partidas", async (req, res) => {
    let juego = null;
    let partidas = null;
    if (Object.keys(req.query).length > 0) {
        console.log(req.query);
        juego = await db.Juego.findByPk(req.query.juegoId);
        partidas = await db.Partida.findAll({
            where: { juegoId: Number(req.query.juegoId) },
        });
    }
    res.render("Client_partidas", { partidas, juego });
});

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