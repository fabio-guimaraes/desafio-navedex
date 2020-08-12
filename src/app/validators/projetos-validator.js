// Validações para os projetos
// Autor: Fábio Guimarães

// validações pela express-validator
const { body, validationResult } = require('express-validator');
// importa arquivo base das validações "express-validator"
const validator = require('./base-validator');

const regrasValidacaoProjetos = () => {
    return [
        // Valida os campos
        body('id').isInt().optional().withMessage('O id deve ser um número inteiro'),
        body('titulo').isLength({ min: 3 }).withMessage('O título deve ser informado e ter no mínimo 3 caracteres'),
        body('navers').isArray().withMessage('O campo dos navers deve ser um array')
    ];
};

const validaProjetos = (req, resp, next) => {
    const erros = validationResult(req).formatWith(validator.formataErros);
    if (erros.isEmpty())
        return next();

    return resp.status(422).json({
        erros: erros.array()
    });
};

module.exports = {
    regrasValidacaoProjetos,
    validaProjetos,
};
