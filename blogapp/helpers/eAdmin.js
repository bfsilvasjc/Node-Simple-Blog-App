// ESTE CÓDIGO SERVE PARA VERIFICAR SE O USUÁRIO ESTÁ LOGADO E SE ELE É ADMIN
// PARA O CONTROLE DE ACESSO DEPEDENDO DO NÍVEL DO USUÁRIO

module.exports = {
    eAdmin: (req, res, next)=>{

        // SE ESTÁ AUTENTICADO/LOGADO E SE FOR ADMIN
        if(req.isAuthenticated() && req.user.admin == 1){
            return next()
        }

        req.flash('error_msg', 'Você precisa entrar como admin!')
        res.redirect('/')
    }
}