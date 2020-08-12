// Arquivo de rotas dos projetos
// Autor: Fábio Guimarães

// importa middleware de autenticação
const authMiddleware = require('../../config/autenticacao');
// importa as validações para aplicar caso tenha filtro
const { regrasValidacaoFiltroProjetos, validaFiltroProjetos } = require('../validators/filtro-projetos-validator');
// importa as validações para aplicar na requisção de projetos
const { regrasValidacaoProjetos, validaProjetos } = require('../validators/projetos-validator');
// imports das classes utilizadas
const ProjetosController = require('../controllers/projetos-controller');

// instância da classe ProjetosController
const projetosController = new ProjetosController();

module.exports = (app) => {

    const rotasProjetos = ProjetosController.rotas();

    // verifica se é uma rota autenticada e executa o processo de autenticação antes de executar a requisição
    app.use(rotasProjetos.autenticadas, authMiddleware);

    // index - lista os projetos (com ou sem filtro)
    app.get(rotasProjetos.index, regrasValidacaoFiltroProjetos(), validaFiltroProjetos, projetosController.lista);

    // show - visualiza um projetos e seus naver
    app.get(rotasProjetos.show, regrasValidacaoFiltroProjetos(), validaFiltroProjetos, projetosController.show);

    // centraliza as validações na rota de cadastro
    app.route(rotasProjetos.cadastro)
        // store - cria um projeto e associa seus navers
        .post(regrasValidacaoProjetos(), validaProjetos, projetosController.create)
        // update - atualiza um naver e seus projetos
        .put(regrasValidacaoProjetos(), validaProjetos, projetosController.update);

    // delete - exclui um naver e seus projetos
    app.delete(rotasProjetos.delete, regrasValidacaoFiltroProjetos(), validaFiltroProjetos, projetosController.remove);

};
