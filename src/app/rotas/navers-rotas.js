// Arquivo de rotas dos navers
// Autor: Fábio Guimarães

// importa middleware de autenticação
const authMiddleware = require('../../config/autenticacao');
// importa as validações para aplicar caso tenha filtro
const { regrasValidacaoFiltroNavers, validaFiltroNavers } = require('../validators/filtro-navers-validator');
// importa as validações para aplicar na requisção de navers
const { regrasValidacaoNavers, validaNavers } = require('../validators/navers-validator');
// imports das classes utilizadas
const NaversController = require('../controllers/navers-controller');

// instância da classe NaversController
const naversController = new NaversController();

module.exports = (app) => {

    const rotasNavers = NaversController.rotas();

    // verifica se é uma rota autenticada e executa o processo de autenticação antes de executar a requisição
    app.use(rotasNavers.autenticadas, authMiddleware);

    // index - lista os navers (com ou sem filtro)
    app.get(rotasNavers.index, regrasValidacaoFiltroNavers(), validaFiltroNavers, naversController.lista);

    // show - visualiza um naver e seus projetos
    app.get(rotasNavers.show, regrasValidacaoFiltroNavers(), validaFiltroNavers, naversController.show);

    // centraliza as validações na rota de cadastro
    app.route(rotasNavers.cadastro)
        // store - cria um naver e associa aos seus projetos
        .post(regrasValidacaoNavers(), validaNavers, naversController.create)
        // update - atualiza um naver e seus projetos
        .put(regrasValidacaoNavers(), validaNavers, naversController.update);

    // delete - exclui um naver e seus projetos
    app.delete(rotasNavers.delete, regrasValidacaoFiltroNavers(), validaFiltroNavers, naversController.remove);

};
