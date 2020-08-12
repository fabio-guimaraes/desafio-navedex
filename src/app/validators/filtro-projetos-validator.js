// Validações para filtro dos projetos
// Autor: Fábio Guimarães

// validações pela express-validator
const { check, validationResult } = require('express-validator');
// importa arquivo base das validações "express-validator"
const validator = require('./base-validator');

const regrasValidacaoFiltroProjetos = () => {
    return [
        check('id').isInt().optional().withMessage('O id deve ser um número inteiro'),
        check('titulo').isLength({ min: 3 }).optional().withMessage('O titulo deve ter no mínimo 3 caracteres'),
    ];
};

const validaFiltroProjetos = (req, resp, next) => {
    const erros = validationResult(req).formatWith(validator.formataErros);
    if (erros.isEmpty())
        return next();

    return resp.status(422).json({
        erros: erros.array()
    });
};

module.exports = {
    regrasValidacaoFiltroProjetos,
    validaFiltroProjetos,
};
