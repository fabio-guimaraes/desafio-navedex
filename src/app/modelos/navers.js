// Classe modelo (Model) para navers
// Autor: Fábio Guimarães

// importa moment para tratamento de datas
const moment = require('moment');
// importa o knex para acesso a base de dados
const knex = require('../../database');

class Navers {

    // tratamento dos campos data da classe Navers
    static formataDatas(rows) {
        rows.forEach(row => {
            // tratando as datas para apresentar no formato correto
            row.nascimento = moment(row.nascimento).format('YYYY-MM-DD');
            row.admissao = moment(row.admissao).format('YYYY-MM-DD');
        });
        return rows;
    };

    // verifica se o navers pertence ao usuário
    async naversPertenceUsuario(params = {}) {        
        const naverUsuario = await knex('users_navers')
            .where('id_naver', params.idNaver)
            .where('id_user', params.idUser);

        return (naverUsuario.length > 0 && naverUsuario[0].id != 0);
    }

    // lista todos os navers de um usuário
    async lista(req, resp, next) {
        // recupera o id do usuário autenticado
        const idUser = req.UserId;
        // Recupera o filtro e o valor a ser utilizado na consulta (se existir)
        // esses dados já foram validados via "express-validator"
        const { filtro } = req.params;

        try {
            var resultados;
            if (!filtro) {
                // busca os navers de um usuário sem filtro
                resultados = await knex.select('navers.*')
                    .from('navers')
                    .join('users_navers', 'users_navers.id_naver', '=', 'navers.id')
                    .where('users_navers.id_user', idUser);               
            } else {
                // separa campo e valor do filtro
                const [campo, valor] = filtro.split('=');

                // busca os navers de um usuário com filtro (campos já foram previamente validados)
                resultados = await knex.select('navers.*')
                    .from('navers')
                    .join('users_navers', 'users_navers.id_naver', '=', 'navers.id')
                    .where('users_navers.id_user', idUser)
                    .where(campo, valor);
            }

            if (resultados.length > 0) {
                return resp.status(200).json(Navers.formataDatas(resultados));
            } else {
                return resp.status(400).send({ error: 'Nenhum registro encontrado na seleção' });
            }
        } catch (error) {
            return next(error);
        }
    };

    // lista naver e seus projetos
    async show(req, resp, next) {
        // Recupera o id do naver ser utilizado na consulta
        const { id } = req.params;

        try {
            const resultado = await knex('navers')  // "await" aguarda a resposta
                .where({ id });

            const [naver] = resultado;

            if (naver) {
                // consulta os projetos do naver
                const projetos = await knex.select('projetos.*')  // "await" aguarda a resposta
                    .from('projetos')
                    .join('users_projetos_navers', 'users_projetos_navers.id_projeto', '=', 'projetos.id')
                    .where('users_projetos_navers.id_naver', id);

                const resultadoFinal = { ...Navers.formataDatas([naver])[0], projetos };
                return resp.status(200).json(resultadoFinal);
            } else {
                return resp.status(400).send({ error: 'Nenhum registro encontrado na base de dados' });
            }
        } catch (error) {
            return next(error);
        }
    }

    // cria um naver e seus projetos
    async create(req, resp, next) {
        // recupera o id do usuário autenticado
        const idUser = req.UserId;
        // Recupera os valores evitando que dados errados sejam considerados no insert
        // esses dados já foram validados via "express-validator"
        const { nome, nascimento, admissao, cargo, projetos } = req.body;

        try {
            // todo o bloco de inclusão fica dentro de uma transação pois o usuário pode
            // ter passado algum projeto inexistente, causando erro. Com a transação
            // caso ocorra algum erro nenhum registro é criado
            try {
                // variável para armazenar o ID naver pois variáveis criadas dentro da transação
                // ficam indefinidas quando a transação termina
                var NaverID;
                await knex.transaction(async trx => {
                    // incluir o navers e recupera o id criado
                    const [newNaver] = await trx('navers')
                        .insert({ nome, nascimento, admissao, cargo })
                        .returning('id');

                    // guarda o ID para repassar no final
                    NaverID = newNaver;

                    // incluir users_navers (associa um naver ao usuário)
                    await trx('users_navers')
                        .insert({ id_user: idUser, id_naver: newNaver });

                    // passa por todos os projetos e inclui na user_projetos_navers
                    for (var i = 0; i < projetos.length; i++) {
                        await trx('users_projetos_navers')
                            .insert({ id_user: idUser, id_projeto: projetos[i], id_naver: newNaver });
                    }
                });
            } catch (error) {
                // transação finalizada com erro
                return resp.status(400).send({
                    error: 'Erro na operação com o banco de dados: ' + error.detail
                });
            }

            // transação finalizada com sucesso - retorna visualizando os dados do naver criado
            req.params.id = NaverID;
            return this.show(req, resp, next);
        } catch (error) {
            return next(error);
        }
    };

    // atualiza um naver e seus projetos
    async update(req, resp, next) {
        // recupera o id do usuário autenticado
        const idUser = req.UserId;
        // Recupera os valores evitando que dados errados sejam considerados no update
        // esses dados já foram validados via "express-validator"
        const { id, nome, nascimento, admissao, cargo, projetos } = req.body;

        try {
            // verifica se o navers pertence ao usuário
            if (await this.naversPertenceUsuario({ idUser: idUser, idNaver: id })) {
                // todo o bloco de update fica dentro de uma transação pois o usuário pode
                // ter passado algum projeto inexistente, causando erro. Com a transação
                // caso ocorra algum erro nenhum registro é modificado
                try {
                    await knex.transaction(async trx => {
                        // atualiza navers
                        await trx('navers')
                            .update({ nome, nascimento, admissao, cargo })
                            .where({ id });

                        // atualiza dados da users_projeto_navers - exclui todos os navers do projeto para depois incluir novamente
                        await trx('users_projetos_navers')
                            .where('id_user', idUser)
                            .where('id_naver', id)
                            .del();

                        for (var i = 0; i < projetos.length; i++) {
                            await trx('users_projetos_navers')
                                .insert({ id_user: idUser, id_projeto: projetos[i], id_naver: id });
                        }
                    });
                } catch (error) {
                    // transação finalizada com erro
                    return resp.status(400).send({
                        error: 'Erro na operação com o banco de dados: ' + error.detail
                    });
                };

                // transação finalizada com sucesso - retorna visualizando os dados do naver atualizado
                req.params.id = id;
                return this.show(req, resp, next);
            } else {
                return resp.status(400).send({ error: 'Nenhum registro encontrado ou naver não pertence ao usuário' });
            }
        } catch (error) {
            return next(error);
        }
    };

    async remove(req, resp, next) {
        // recupera o id do usuário autenticado
        const idUser = req.UserId;
        // Recupera o id do naver ser excluído
        const id = parseInt(req.params.id);

        try {
            if (await this.naversPertenceUsuario({ idUser: idUser, idNaver: id })) {
                // Exclui o naver da users_projeto_navers
                await knex('users_projetos_navers')                    
                    .where('id_naver', id)
                    .del();
                // Exclui da users_navers
                await knex('users_navers')
                    .where('id_user', idUser)
                    .where('id_naver', id)
                    .del();                
                // Exclui da navers
                await knex('navers')
                    .where({ id })
                    .del();

                return resp.status(200).json({ mensagem: 'Naver excluído' });
            } else {
                return resp.status(400).send({ error: 'Nenhum registro encontrado ou naver não pertence ao usuário' });
            }
        } catch (error) {
            return next(error);
        }
    };

}

module.exports = Navers;
