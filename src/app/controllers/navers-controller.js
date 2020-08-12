// Controller para os navers
// Autor: Fábio Guimarães

// importa classe de modelo dos navers
const Navers = require('../modelos/navers');
// instância de navers
const navers = new Navers();

class NaversController {

    // método da classe que contém as rotas a serem utilizadas
    static rotas() {
        return {
            autenticadas: '/navers*',
            cadastro: '/navers',
            index: '/navers/index/:filtro?',
            show: '/navers/:id',
            store: '/navers',
            update: '/navers',
            delete: '/navers/:id'
        }
    };

    // lista navers (com ou sem filtro)
    lista(req, resp, next) {
        navers.lista(req, resp, next);
    };

    // visualiza um naver e seus projetos
    show(req, resp, next) {
        navers.show(req, resp, next);
    };

    // cria um naver e associa aos seus projetos
    create(req, resp, next) {
        navers.create(req, resp, next);
    };

    // atualiza um naver e seus projetos
    update(req, resp, next) {
        navers.update(req, resp, next);
    };

    // exclui um naver e seus projetos
    remove(req, resp, next) {
        navers.remove(req, resp, next);
    };

};

module.exports = NaversController;
