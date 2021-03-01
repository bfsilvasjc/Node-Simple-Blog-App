// IMPORTANDO MÓDULOS
const express = require('express')
const handlebars = require('express-handlebars')
const bodyparser = require('body-parser')
const app = express()
const admin = require('./routes/admin')
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')

// Configurações

// SESSÃO
app.use(session({
    secret: 'chaveDeSeguranca',
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

// MIDDLEWARE
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

// BODY-PARSER
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())

// HANDLEBARS
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// MONGOOSE
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/blogapp').then(()=>{
    console.log('Conectado com sucesso!')
}).catch((err)=>{
    console.log('Erro ao conectar: ' + err)
})

// PUBLIC
app.use(express.static(path.join(__dirname, 'public')))
app.use((req, res, next)=>{
    console.log('aqui é um middleware!')
    next()
})

// Rotas
app.use('/admin', admin)

// Outros
const port = 8081
app.listen(port, ()=>{
    console.log('Servidor rodando!')
})