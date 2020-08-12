// Programa principal (servidor) API navedex
// Autor: Fábio Guimarães

// importa módulo custom-express (módulo express configurado)
const app = require('../src/config/custom-express');

// coloca o servidor em execução na porta 3000
app.listen(3000, () => console.log('Servidor em execução'));
