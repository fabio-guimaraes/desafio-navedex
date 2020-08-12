// Configurações principais da aplicação (app express) e outras bibliotecas
// Autor: Fábio Guimarães

// importa o módulo do framework express e body-parser
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// configura o bodyParser para ler o corpo das requisições corretamente
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// obtem arquivo das rotas
const rotas = require('../app/rotas/rotas');
rotas(app);

// middleware "Catch All" para captura e tratamento de erros
app.use((error, req, resp, next) => {
    resp.status(error.status || 500)
    resp.json({ error: error.message })
});

module.exports = app;
