const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')
require('../models/Postagem')
const Categoria = mongoose.model('categorias')
const Postagem = mongoose.model('postagens')

router.get('/', (req, res)=>{
    //res.render('./admin/index')
    res.redirect('/admin/postagens')
})

router.get('/posts', (req, res)=>{
    res.send('Página de posts')
})

router.get('/categorias', (req, res)=>{
    Categoria.find().lean().sort({date:'desc'}).then((categorias)=>{
        res.render('./admin/categorias', {categorias})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as categorias')
        res.redirect('/admin')
    })
})

router.get('/categorias/add', (req, res)=>{
    res.render('admin/addcategorias')
})

router.post('/categorias/nova', (req, res)=>{

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:'Nome inválido!'})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:'Slug inválido!'})
    }

    if(req.body.nome.length < 2){
        erros.push({texto: 'Nome da categoria é muito pequeno!'})
    }

    if(erros.length > 0){
        res.render('admin/addcategorias', {erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
    
        new Categoria(novaCategoria).save().then(()=>{
            console.log('Categoria cadastrada com sucesso!')
            req.flash('success_msg', 'Categoria criada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            console.log('Erro ao cadastrar categoria: ' + err)
            req.flash('error_msg', 'Houve um erro ao salvar a categria, tente novamente!')
            res.redirect('/admin/categorias')
        })
    }
})

router.get('/categorias/edit/:id', (req, res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('admin/editcategorias', categoria)
    }).catch((err)=>{
        console.log('Ocorreu um erro: ' + err)
        req.flash('error_msg', 'Esta categoria não existe!')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/delete', (req, res)=>{
    Categoria.remove({_id:req.body.id}).then(()=>{
        req.flash('success_msg', 'Categoria excluída com sucesso!')
        res.redirect('/admin/categorias')
    }).catch((err)=>{
        console.log('Houve um erro: ' + err)
        req.flash('error_msg', 'Houve um erro interno ao excluir categoria!')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/edit', (req, res)=>{
    Categoria.findOne({_id: req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(()=>{
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            console.log('Ocorreu um erro: ' + err)
            req.flash('error_msg', 'Houve um erro interno ao editar a categoria!')
            res.redirect('/admin/categorias')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao editar a categoria!')
        res.redirect('/admin/categorias')
    })
})

router.get('/postagens', (req, res)=>{
    Postagem.find().lean().populate('categoria').sort({data:'desc'}).then((postagens)=>{
        res.render('admin/postagens', {postagens})
    }).catch((err)=>{
        req.flash('error_msg', 'Houve um erro ao listar as postagens')
        res.redirect('/admin')
    })
})

router.get('/postagens/add', (req, res)=>{
    Categoria.find().lean().then((categorias)=>{
        res.render('admin/addpostagem', {categorias})
    }).catch((err)=>{
        console.log('Ocorreu um erro: ' + err)
        req.flash('error_msg', 'Houve um erro interno ao carregar as categoria!')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/nova', (req, res)=>{
    var erros = []

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
        erros.push({texto:'Título inválido!'})
    }
    
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:'Slug inválido!'})
    }

    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
        erros.push({texto:'Descricao inválido!'})
    }

    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
        erros.push({texto:'Conteudo inválido!'})
    }

    if(req.body.titulo.length < 4){
        erros.push({texto: 'O título é muito pequeno!'})
    }

    if(req.body.categoria == 0){
        erros.push({texto: 'Selecione uma categoria! Caso não existe, crie uma nova categoria!'})
    }

    if(erros.length > 0){
        res.render('admin/addpostagem', {erros})
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(()=>{
            console.log('Postagem cadastrada com sucesso!')
            req.flash('success_msg', 'Postagem criada com sucesso!')
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            console.log('Erro ao cadastrar postagem: ' + err)
            req.flash('error_msg', 'Houve um erro ao salvar a postagem, tente novamente!')
            res.redirect('/admin/postagens')
        })
    }
})

router.get('/postagens/edit/:id', (req, res)=>{
    Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categorias)=>{
            res.render('admin/editpostagens', {postagem, categorias})
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao listar categorias')
            res.redirect('/admin/postagens')
        })
    }).catch((err)=>{
        req.flash('error_msg', 'Ocorreu um erro ao carregar dados para edição da postagem')
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit/', (req, res)=>{
    //req.body.id
    Postagem.findOne({_id:req.body.id}).then((postagem)=>{
        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then((()=>{
            req.flash('success_msg', 'Postagem editada com sucesso')
            res.redirect('/admin/postagens')
        })).catch((err)=>{
            req.flash('error_msg', 'Houve um erro ao editar postagem')
            res.redirect('/admin/postagens')
        })
    })
})

router.post('/postagens/delete', (req, res)=>[
    Postagem.remove({_id:req.body.id}).then(()=>{
        req.flash('success_msg', 'Postagem excluída com sucesso!')
        res.redirect('/admin/postagens')
    }).catch((err)=>{
        console.log('Erro ao excluir postagem: ' + err)
        req.flash('error_msg', 'Houve um erro ao apagar a postagem')
        res.redirect('/admin/postagens')
    })
])

module.exports = router;