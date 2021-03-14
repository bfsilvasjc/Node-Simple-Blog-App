const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')

module.exports = (passport)=>{

    // CONFIGURA O NOME DO CAMPO QUE SERÁ USADO NA AUTENTICAÇÃO
    passport.use(new localStrategy({usernameField:'email', passwordField: 'senha'}, (email, senha, done)=>{

        // PROCURA NO BD UM USUÁRIO QUE TENHO O MESMO EMAIL DO EMAIL ENVIADO PARA A AUTENTICAÇÃO
        Usuario.findOne({email: email}).then((usuario)=>{

            // CASO ACHAR UM USUÁRIO COM O EMAIL INFORMADO NA AUTENTICAÇÃO
            if(usuario){
                // FAZ A COMPARAÇÃO ENTRE OS DOIS HASH (SENHA ENVIADA PARA AUTENTICAÇÃO E SENHA GRAVADA NO BD)
                bcrypt.compare(senha, usuario.senha, (erro, batem)=>{
                    if(batem){ // SE AS SENHAS FOREM IGUAIS
                        return done(null, usuario)
                    }else{ // SE AS SENHAS FOREM DIFERENTES
                        return done(null, false, {message: 'Senha incorreta!'})
                    }
                })
            }else{
                // CASO NÃO EXISTA NO BANCO DE DADOS UMA CONTA COM O EMAIL ENVIADO PARA AUTENTICAÇÃO
                return done(null, false, {message: 'Essa conta não existe!'})
            }
        })
    }))

    // PASSA OS DADOS DO USUÁRIO PRA UMA SESSÃO
    passport.serializeUser((usuario, done)=>{
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done)=>{
        Usuario.findById(id, (err, usuario)=>{
            done(err, usuario)
        })
    })
}