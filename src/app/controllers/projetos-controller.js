// Controller para os projetos
// Autor: Fábio Guimarães

// importa classe de modelo dos projetos
const Projetos = require('../modelos/projetos');
// instância de projetos
const projetos = new Projetos();

class ProjetosController {

    // método da classe que contém as rotas a serem utilizadas
    static rotas() {
        return {
            autenticadas: '/projetos*',
            cadastro: '/projetos',
            index: '/projetos/index/:titulo?',
            show: '/projetos/:id',
            store: '/projetos',
            update: '/projetos',
            delete: '/projetos/:id'
        }
    };

    // lista projetos (com ou sem filtro)
    lista(req, resp, next) {
        projetos.lista(req, resp, next);
    };

    // visualiza um projeto e seus navers
    show(req, resp, next) {
        projetos.show(req, resp, next);
    };

    // cria um projeto e associa aos seus navers
    create(req, resp, next) {
        projetos.create(req, resp, next);
    };

    // atualiza um projeto e seus navers
    update(req, resp, next) {
        projetos.update(req, resp, next);
    };

    // exclui um projeto e seus navers
    remove(req, resp, next) {
        projetos.remove(req, resp, next);
    };

};

module.exports = ProjetosController;
