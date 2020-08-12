// Validações para filtro dos navers
// Autor: Fábio Guimarães

// validações pela express-validator
const { check, validationResult } = require('express-validator');
// importa arquivo base das validações "express-validator"
const validator = require('./base-validator');
// Importa moment para tratamento de datas
const moment = require('moment');

const regrasValidacaoFiltroNavers = () => {
    return [
        check('id').isInt().optional().withMessage('O id deve ser um número inteiro'),
        check('filtro').custom(value => {
            if (!value)
                return Promise.resolve();
            
            const parts = value.split('=');
            // se não possui 2 partes está com erro
            if (!parts.length == 2)
                return Promise.reject('Erro no parâmetro do filtro');

            // separa as duas partes em váriáveis
            const [campo, valor] = parts;

            // se não possui a string nome, cargo ou admissao no início está com erro no formato
            if (!/^nome$/i.test(campo) && !/^cargo$/i.test(campo) && !/^admissao$/i.test(campo))
                return Promise.reject('O filtro deve ser por <nome>, <cargo> ou <admissao>');

            // faz a validação dos campos com os valores passados
            switch (campo) {
                case 'admissao':
                    if (!moment(valor, 'YYYY-MM-DD').isValid())
                        return Promise.reject('A data deve ser válida e informada no formato <YYYY-MM-DD>');
                    break;
                case 'nome':
                    if (valor.length < 5)
                        return Promise.reject('O campo do filtro por nome deve ter no mínimo 5 caracteres');
                    break;
                case 'cargo':
                    if (valor.length < 3)
                        return Promise.reject('O campo do filtro pelo cargo deve ter no mínimo 3 caracteres');
                    break;
                default:
                    return Promise.reject('Não foi possível validar o tipo do filtro');
            }
            return Promise.resolve();
        })         
    ];
};

const validaFiltroNavers = (req, resp, next) => {
    const erros = validationResult(req).formatWith(validator.formataErros);
    if (erros.isEmpty())
        return next();

    return resp.status(422).json({
        erros: erros.array()
    });
};

module.exports = {
    regrasValidacaoFiltroNavers,
    validaFiltroNavers,
};
