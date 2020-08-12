// Arquivo de rotas dos usuários
// Autor: Fábio Guimarães

// importa as validações para aplicar na requisção de usuários
const { regrasValidacaoUser, validaUser } = require('../validators/users-validator')
// imports das classes utilizadas
const UsersController = require('../controllers/users-controller');

// instância da classe UsersController
const usersController = new UsersController();

module.exports = (app) => {

    const rotasUsers = UsersController.rotas();

    // signup - cria um novo usuário
    app.route(rotasUsers.signup)
        .post(regrasValidacaoUser(), validaUser, usersController.signup);

    // login - login de usuário
    app.route(rotasUsers.login)
        .get(regrasValidacaoUser(), validaUser, usersController.login);

};
