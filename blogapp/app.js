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
require('./models/Postagem')
const Postagem = mongoose.model('postagens')
require('./models/Categoria')
const Categoria = mongoose.model('categorias')

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
    next()
})

// Rotas
app.get('/', (req, res)=>{
    Postagem.find().lean().populate('categoria').sort({data:'desc'}).then((postagens)=>{
        res.render('index', {postagens})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/404')
    })
})

app.get('/404', (req, res)=>{
    res.send('Erro 404!')
})

app.get('/postagem/:slug', (req, res)=>{
    Postagem.findOne({slug: req.params.slug}).then((postagem)=>{
        if(postagem){
            res.render('postagem/index', postagem)
        }else{
            req.flash('error_msg', 'Essa postagem não existe!')
            res.redirect('/')
        }
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno!')
        res.redirect('/')
    })
})

app.get('/categorias', (req, res)=>{
    Categoria.find().lean().sort({date:'desc'}).then((categorias)=>{
        res.render('./categorias/index', {categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/')
    })
})

app.get('/categorias/:slug', (req, res)=>{
    Categoria.findOne({slug:req.params.slug}).then((categoria)=>{
        if(categoria){
            Postagem.find({categoria: categoria._id}).lean().then((postagens)=>{
                res.render('categorias/postagens', {categoria, postagens})
            }).catch((err)=>{
                req.flash('error_msg', 'Houve um erro interno ao listar os posts!')
                res.redirect('/')
            })
        }else{
            req.flash('error_msg', 'Essa categoria não existe!')
            res.redirect('/')
        }
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro interno!')
        res.redirect('/')
    })
})

app.use('/admin', admin)

// Outros
const port = 8081
app.listen(port, ()=>{
    console.log('Servidor rodando!')
})