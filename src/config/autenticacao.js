// Middleware responsável por verificar se a requisição está autenticada
// Autor: Fábio Guimarães

// Importa biblioteca JWT e configurações
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

module.exports = (req, resp, next) => {
    // recupera do cabeçalho o token
    const authHeader = req.headers['x-access-token'];

    // --- validações iniciais ---
    // verifica se o token foi passado
    if (!authHeader)
        return resp.status(401).send({ error: 'Nenhum token informado' });

    // valida se o token está no formato JWT (Bearer + Hash)
    const parts = authHeader.split(' ');  // "separa" as duas partes do token

    // se não possui 2 partes está com erro
    if (!parts.length == 2)
        return resp.status(401).send({ error: 'Token com erro' });

    // separa as duas partes em váriáveis
    const [scheme, token] = parts;

    // se não possui a string Bearer no início está com erro no formato
    if (!/^Bearer$/i.test(scheme))
        return resp.status(401).send({ error: 'Token mal formado' });
    // --- fim dasvalidações iniciais ---

    // verifica o token e caso esteja correto coloca na variável decoded o id do usuário
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err)
            return resp.status(401).send({ error: 'Token inválido' });

        // coloca o id do usuário na requisição
        req.UserId = decoded.id;
        // segue o fluxo
        return next();
    });
};
