const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require ('bcrypt');
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

app.get("/partida/admin", (req, res) => {
    res.render('Admin_partida')
})

app.listen(PORT, ()=> {
    console.log(`El servidor inicio correctamente en el puerto ${PORT}`);
})