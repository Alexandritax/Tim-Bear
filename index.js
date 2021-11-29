const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require ('bcrypt');
const db = require('./dao/models');
const saltRounds = 10

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(express.static('assets')) // soporte de archivos estaticos
app.set('view engine', 'ejs') // Configuramos el motor de templates
app.use(session({
    secret : "daleu",
    resave : false,
    saveUninitialized : false
})) 

app.get('/', (req, res) => { //Usuario: "Admin" || "Usuario" || "Default"
    if (req.session.username != undefined) {
        req.session.lastLogin = new Date().getTime()
        if(req.session.rol == "Admin"){
            res.redirect('/admin')
        }
        else{
            res.redirect('/client')
        }
    }else {
        res.render('Default')
    }
    
})

app.get('/reglas', (req,res)=>{
    res.render('reglas')
})

app.get('/terminos', (req,res)=>{
    res.render('terminos')
})

app.get('/nosotros', (req,res)=>{
    res.render('nosotros')
})

app.get('/client',(req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if(req.session.rol != undefined){
    if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.redirect('/')
    }else{
        res.render('Client_page')
    }}else{
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

    let errors = []
    if (clienteContrasenia !== clienteContrasenia2) {
        errors.push({msg: 'Las contraseñas no coinciden'})
        res.redirect('/cliente/nuevo')
    }

    await db.Cliente.create({
        nombre: clienteNombre,
        apellidos: clienteApellidos,
        dni: clienteDNI,
        imagen_url: clienteFoto,
        correo: clienteCorreo,
        contrasenia: clienteContrasenia,
        telefono: clienteTelefono,
        direccion: clienteDireccion,
        departamentoId: clienteDepartamentoId,
        provinciaId: clienteProvinciaId,
        distritoId: clienteDistritoId,
        pep: clientePEP,
        estado: "pendiente de validación"
    })

    res.redirect('/client/wait')
})

app.get('/client/wait', async (req, res) => {
    res.render('Client_wait')
})

app.get('/admin', (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if(req.session.rol != undefined){
        if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.redirect('/')
    }else{
        res.render('Admin_page')
    }}else{
        res.redirect('/')
    }
})

app.post("/", async (req,res) => {
    const username = req.body.username
    const password = req.body.password
    const FoundUser = 'pw'
    const correctPW = "123"
    let passwordhash = await bcrypt.hash(correctPW, saltRounds) //pasar a registro de BD
    let compare = await bcrypt.compare(password, passwordhash)


    if (username == FoundUser && compare) {
        // Login correcto
        req.session.username = username // guardando variable en sesion
        req.session.rol = "Admin"
        res.redirect('/admin')
    }else{
        console.log("contraseña incorrecta")
        res.render('Default')
    }
})

// PARTIDAS
app.get("/partida/admin",async (req, res) => {
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


    if(req.session.rol != undefined){
    if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.redirect('/')
    }else{
        res.render('Admin_partida',{
            partidaLista : aPartidasRegistradas
        })
    }}else{
        res.redirect('/')
    }
   
    
})

// CLIENTES
app.get("/cliente/admin",async (req, res) => {
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


    if(req.session.rol != undefined){
    if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.redirect('/')
    }else{
        res.render('Admin_cliente',{
            clienteLista : aClienteRegistradas
        })
    }}else{
        res.redirect('/')
    }
   
    
})


app.get("/juego/admin", (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if(req.session.rol != undefined){
    if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.redirect('/')
    }else{
        res.render('Admin_juego')
    }}else{
        res.redirect('/')
    }
})

app.get("/juego/new", (req, res) => {
    const timestampActual = new Date().getTime();
    const dif = timestampActual - req.session.lastLogin

    if(req.session.rol != undefined){
    if (dif >= 3 * 60 * 60 * 1000) {
        req.session.destroy() // Destruyes la sesion
        res.redirect('/')
    }else{
        res.render('Juegos_new')
    }}else{
        res.redirect('/')
    }
})

app.listen(PORT, ()=> {
    console.log(`El servidor inicio correctamente en el puerto ${PORT}`);
})