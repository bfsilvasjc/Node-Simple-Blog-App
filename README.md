# Node-Simple-Blog-App
Projeto para prática dos estudos de NodeJS e MongoDB.

Foram utilizadas nesse projeto as ferramentas:
    - Express para a configuração servidor local e rotas;
    - Mongoose para manipulação do banco de dados mongodb (NoSQL);
    - Handlebars e Flash para manipulação das views e exibição dos resultados;
    - Bcryptjs para gerar códigos hash das senhas de usuários;
    - Passport para autenticação de login;
    - Entre outras.

Todas as ferramentas usadas no projeto estão listadas no package.json.

Basicamente o projeto se resume a um blog simples capaz de manipular usuários e postagens e vincular esses posts com categorias previamente cadastradas e relacionadas. 
O usuário com nível de acesso de administrador é capaz de manipular (CRUD) as postagens e as categorias.
Um sistema de autenticação faz a análise e a liberação/bloqueio de acesso aos recursos da aplicação de acordo com o nível de acesso do usuário logado.