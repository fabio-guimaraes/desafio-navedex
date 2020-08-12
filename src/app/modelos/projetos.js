// Classe modelo (Model) para projetos
// Autor: Fábio Guimarães

// importa o knex para acesso a base de dados
const knex = require('../../database');
// importa a classe Navers para formatar as datas
const Navers = require('./navers');

class Projetos {

    // verifica se o projeto pertence ao usuário
    async projetoPertenceUsuario(params = {}) {
        const projetoUser = await knex('users_projetos')
            .where('id_projeto', params.idProjeto)
            .where('id_user', params.idUser);

        return (projetoUser.length > 0 && projetoUser[0].id_projeto != 0);
    }
  
    // lista todos os projetos de um usuário
    async lista(req, resp, next) {
        // recupera o id do usuário autenticado
        const idUser = req.UserId;
        // Recupera o titulo (filtro) a ser utilizado na consulta (se existir)
        // esse parâmetro já foi validados via "express-validator"
        const { titulo } = req.params;

        try {
            var resultados;
            if (!titulo) {
                // busca os projetos de um usuário sem filtro
                resultados = await knex.select('projetos.*')
                    .from('projetos')
                    .join('users_projetos', 'users_projetos.id_projeto', '=', 'projetos.id')
                    .where('users_projetos.id_user', idUser);
            } else {
                // busca os projetos de um usuário com filtro (titulo já foi previamente validado)
                resultados = await knex.select('projetos.*')
                    .from('projetos')
                    .join('users_projetos', 'users_projetos.id_projeto', '=', 'projetos.id')
                    .where('users_projetos.id_user', idUser)
                    .where('projetos.titulo', titulo);
            }

            if (resultados.length > 0) {
                return resp.status(200).json(resultados);
            } else {
                return resp.status(400).send({ error: 'Nenhum registro encontrado na seleção' });
            }
        } catch (error) {
            return next(error);
        }
    };

    // lista projeto e seus navers
    async show(req, resp, next) {
        // Recupera o id do projeto a ser utilizado na consulta
        const { id } = req.params;

        try {
            const resultado = await knex('projetos')  // "await" aguarda a resposta
                .where({ id });

            const [projeto] = resultado;

            if (projeto) {
                // consulta os navers do projeto
                const resultado = await knex.select('navers.*')  // "await" aguarda a resposta
                    .from('navers')
                    .join('users_projetos_navers', 'users_projetos_navers.id_naver', '=', 'navers.id')
                    .where('users_projetos_navers.id_projeto', id);

                const navers = Navers.formataDatas(resultado);
                const resultadoFinal = { ...([projeto])[0], navers };
                return resp.status(200).json(resultadoFinal);
            } else {
                return resp.status(400).send({ error: 'Nenhum registro encontrado na base de dados' });
            }
        } catch (error) {
            return next(error);
        }
    }

    // cria um projeto e associa seus navers (se forem passados)
    async create(req, resp, next) {
        // recupera o id do usuário autenticado
        const idUser = req.UserId;
        // Recupera os valores evitando que dados errados sejam considerados no insert
        // esses dados já foram validados via "express-validator"
        const { titulo, navers } = req.body;

        try {
            // todo o bloco de inclusão fica dentro de uma transação pois o usuário pode
            // ter passado algum naver inexistente, causando erro. Com a transação
            // caso ocorra algum erro nenhum registro é criado
            try {
                // variável para armazenar o ID projeto pois variáveis criadas dentro da transação
                // ficam indefinidas quando a transação termina
                var ProjectID;
                await knex.transaction(async trx => {
                    // inclui o projeto e recupera o id criado
                    const [newProjeto] = await trx('projetos')
                        .insert({ titulo })
                        .returning('id');

                    // guarda o ID para repassar no final
                    ProjectID = newProjeto;
                    
                    // inclui na users_projetos (associa um projeto ao usuário)
                    await trx('users_projetos')
                        .insert({ id_user: idUser, id_projeto: newProjeto });

                    // passa por todos os navers e inclui na users_projetos_navers
                    for (var i = 0; i < navers.length; i++) {
                        // inclui na users_projetos_navers
                        await trx('users_projetos_navers')
                            .insert({ id_user: idUser, id_projeto: newProjeto, id_naver: navers[i] });
                    };
                });
            } catch (error) {
                // transação finalizada com erro
                return resp.status(400).send({
                    error: 'Erro na operação com o banco de dados: ' + error.detail
                });
            }
            // transação finalizada com sucesso - retorna visualizando os dados do projeto criado
            req.params.id = ProjectID;
            return this.show(req, resp, next);
        } catch (error) {
            return next(error);
        }
    };

    // atualiza um projeto e seus navers
    async update(req, resp, next) {
        // recupera o id do usuário autenticado
        const idUser = req.UserId;
        // Recupera os valores evitando que dados errados sejam considerados no update
        // esses dados já foram validados via "express-validator"
        const { id, titulo, navers } = req.body;

        try {
            // verifica se o projeto pertence ao usuário
            if (await this.projetoPertenceUsuario({ idUser: idUser, idProjeto: id })) {
                // todo o bloco de update fica dentro de uma transação pois o usuário pode
                // ter passado algum naver inexistente, causando erro. Com a transação
                // caso ocorra algum erro nenhum registro é modificado
                try {
                    await knex.transaction(async trx => {
                        // atualiza projetos
                        await trx('projetos')
                            .update({ titulo })
                            .where({ id });

                        // atualiza dados da users_projeto_navers - exclui todos os navers do projeto para depois incluir novamente
                        await trx('users_projetos_navers')
                            .where('id_user', idUser)
                            .where('id_projeto', id)
                            .del();

                        for (var i = 0; i < navers.length; i++) {
                            // insere novamente os navers no projeto
                            // como existe uma integridade no banco entre usuário x navers, caso um naver
                            // que não pertenca ao usuário não será feita a inclusão e retornará um erro
                            await trx('users_projetos_navers')
                                .insert({ id_user: idUser, id_projeto: id, id_naver: navers[i] });
                        };
                    });
                } catch (error) {
                    // transação finalizada com erro
                    return resp.status(400).send({
                        error: 'Erro na operação com o banco de dados: ' + error.detail
                    });
                };

                // transação finalizada com sucesso - retorna visualizando os dados do projeto atualizado
                req.params.id = id;
                return this.show(req, resp, next);
            } else {
                return resp.status(400).send({ error: 'Nenhum registro encontrado ou projeto não pertence ao usuário' });
            }
        } catch (error) {
            return next(error);
        }
    };

    async remove(req, resp, next) {
        // recupera o id do usuário autenticado
        const idUser = req.UserId;
        // Recupera o id do projeto a ser excluído
        const id = parseInt(req.params.id);

        try {
            if (await this.projetoPertenceUsuario({ idUser: idUser, idProjeto: id })) {
                // Exclui da users_projeto_navers
                await knex('users_projetos_navers')
                    .where('id_user', idUser)
                    .where('id_projeto', id)
                    .del();
                // Exclui da users_projetos
                await knex('users_projetos')
                    .where('id_user', idUser)
                    .where('id_projeto', id)
                    .del();
                // Exclui da projetos
                await knex('projetos')
                    .where({ id })
                    .del();

                return resp.status(200).json({ mensagem: 'Projeto excluído' });
            } else {
                return resp.status(400).send({ error: 'Nenhum registro encontrado ou projeto não pertence ao usuário' });
            }
        } catch (error) {
            return next(error);
        }
    };

}

module.exports = Projetos;
