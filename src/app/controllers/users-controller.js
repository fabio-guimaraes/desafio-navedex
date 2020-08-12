// Controller para os users
// Autor: Fábio Guimarães

// importa classe de modelo dos users
const Users = require('../modelos/users');
// instância de Users
const users = new Users();

class UsersController {

    // método da classe que contém as rotas a serem utilizadas
    static rotas() {
        return {
            signup: '/signup',
            login: '/login'
        }
    };

    // cria um novo usuário
    signup(req, resp, next) {
        users.signup(req, resp, next);
    };

    // login de usuário
    login(req, resp, next) {
        users.login(req, resp, next);
    };

};

module.exports = UsersController;
