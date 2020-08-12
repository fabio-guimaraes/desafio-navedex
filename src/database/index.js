// Configuração do acesso ao banco de dados utilizando knex
// Autor: Fábio Guimarães

// configura o objeto knex para ser utilizado pela aplicação
const knexfile = require('../../knexfile');

const knex = require('knex')(knexfile.development);

module.exports = knex;
