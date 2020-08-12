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
    app.post(rotasUsers.signup,
        regrasValidacaoUser(), validaUser, usersController.signup);

    // login - login de usuário
    app.get(rotasUsers.login,
        regrasValidacaoUser(), validaUser, usersController.login);

};
