// Classe "Model" para users
// Autor: Fábio Guimarães

// importa o acesso a base de dados
const knex = require('../../database');
// importa bcrypt para criptografar/descriptografar as senhas
const bcrypt = require('bcryptjs');
// importa JWT para geração do token
const jwt = require('jsonwebtoken');
// importa a configuração com o hash para uso com JWT
const authConfig = require('../../config/auth.json');

class Users {

    // busca um usuário no banco pelo e-mail
    async buscaUsuarioPorEmail(params = {}) {
        const resultado = await knex('users')
            .where('email', params.email);

        const [user] = resultado;
        return (user);
    }

    // cria um novo usuário
    async signup(req, resp, next) {
        // recupera parâmetros do body da requisição
        const { email, senha } = req.body;

        try {
            // verifica se o usuário já existe
            const user = await this.buscaUsuarioPorEmail({ email });
            if (user)
                return resp.status(400).send({ error: 'Usuário já cadastrado' });

            // criptografa a senha
            const pwd = await bcrypt.hash(senha, 10);
            // cria o usuário no banco
            await knex('users')  // incluir o users e recupera o id criado
                .insert({ email: email, senha: pwd });

            // envia resposta com status 201 - Created
            return resp.status(201).send();
        } catch (error) {
            return next(error);
        }
    };

    // tenta fazer o login de um usuário e caso não dê erro retorna o token para acesso
    // as demais funcionalidades
    async login(req, resp, next) {
        // recupera parâmetros do body da requisição
        const { email, senha } = req.body;

        try {
            // verifica se o usuário existe
            const user = await this.buscaUsuarioPorEmail({ email });
            if (!user)
                return resp.status(400).send({ error: 'Usuário não encontrado' });

            // verifica a senha
            if (!await bcrypt.compare(senha, user.senha))
                return resp.status(400).send({ error: 'Senha inválida' });

            // gera o token passando o id do usuário como parâmetro e hash da aplicação
            // para efeito de teste o token é válido por 1 dia
            const token = jwt.sign({ id: user.id }, authConfig.secret, {
                expiresIn: authConfig.expires,
            });

            // retorna o token gerado na resposta
            return resp.status(200).json({ token });
        }
        catch (error) {
            return next(error);
        }
    };
}

module.exports = Users;
