// Arquivo base das rotas
// Autor: Fábio Guimarães

// importa as rotas da API
const naversRotas = require('./navers-rotas');
const userRotas = require('./user-rotas');
const projetosRotas = require('./projetos-rotas');

module.exports = (app) => {
    naversRotas(app),
        userRotas(app),
        projetosRotas(app)
};
