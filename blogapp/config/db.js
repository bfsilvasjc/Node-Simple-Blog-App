if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: 'mongodb+srv://usuarioBdBlogApp:hfjuEmQ2GPsVw7eQ@cluster0.eeriz.mongodb.net/Cluster0?retryWrites=true&w=majority'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost/blogapp'}
}