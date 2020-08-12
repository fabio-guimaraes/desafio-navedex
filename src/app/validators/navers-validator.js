// Validações para os navers
// Autor: Fábio Guimarães

// validações pela express-validator
const { body, validationResult } = require('express-validator');
// importa arquivo base das validações "express-validator"
const validator = require('./base-validator');
// Importa moment para tratamento de datas
const moment = require('moment');

const regrasValidacaoNavers = () => {
    return [
        // Valida os campos
        body('id').isInt().optional().withMessage('O id deve ser um número inteiro'),
        body('nome').isLength({ min: 5 }).withMessage('O nome deve ser informado e ter no mínimo 5 caracteres'),
        body(['nascimento', 'admissao']).custom(value => {
            if (!value)
                return Promise.reject('A informação da data é obrigatória');

            const dataAtual = moment().format('YYYY-MM-DD');

            // faz a validação das datas
            if ((!moment(value, 'YYYY-MM-DD').isValid()) || (!moment(value, 'YYYY-MM-DD').isSameOrBefore(dataAtual)))
                return Promise.reject('A data deve ser válida (<= data atual) e informada no formato <YYYY-MM-DD>');

            return Promise.resolve();
        }),
        body('cargo').isLength({ min: 3 }).withMessage('O cargo deve ser informado e ter no mínimo 3 caracteres'),
        body('projetos').isArray().withMessage('O campo dos projetos deve ser um array')
    ];
};

const validaNavers = (req, resp, next) => {
    const erros = validationResult(req).formatWith(validator.formataErros);
    if (erros.isEmpty())
        return next();

    return resp.status(422).json({
        erros: erros.array()
    });
};

module.exports = {
    regrasValidacaoNavers,
    validaNavers,
};
