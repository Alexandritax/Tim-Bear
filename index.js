const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

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

app.get('/', (req, res) => {
    res.render('index')
})



app.listen(PORT, ()=> {
    console.log(`El servidor inicio correctamente en el puerto ${PORT}`);
})