// Validações para usuários
// Autor: Fábio Guimarães

// validações pela express-validator
const { body, validationResult } = require('express-validator');
// importa arquivo base das validações "express-validator"
const validator = require('./base-validator');

const regrasValidacaoUser = () => {
    return [
        // email de existir e ser válido
        body('email').exists().isEmail().withMessage('O e-mail deve ser informado e ser válido'),
        // senha deve existir e ter no mínimo 5 caracteres
        body('senha').isLength({ min: 5 }).withMessage('A senha deve ser informada e ter no mínimo 5 caracteres')
    ];
};

const validaUser = (req, resp, next) => {
    const erros = validationResult(req).formatWith(validator.formataErros);
    if (erros.isEmpty())
        return next();

    return resp.status(422).json({
        erros: erros.array()
    });
};

module.exports = {
    regrasValidacaoUser,
    validaUser,
};
