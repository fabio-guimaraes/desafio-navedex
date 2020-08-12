// Arquivo base das validações 
// Autor: Fábio Guimarães

// Formata as mensagens de erro retornadas pelo "express-validator"
const formataErros = ({ location, msg, param, value, nestedErrors }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return `[ ${param} ]: ${msg}`;
};

module.exports = {
    formataErros,
};    
