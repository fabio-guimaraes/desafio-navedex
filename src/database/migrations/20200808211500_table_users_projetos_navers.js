// Tabela de relação de usuários x projetos x navers
// Autor: Fábio Guimarães

// criação
exports.up = knex => knex.schema.createTable('users_projetos_navers', table => {
    table.integer('id_user')
        .notNullable();
    table.integer('id_projeto')
        .notNullable();
    table.integer('id_naver')
        .notNullable();
    // relacionamento com a tabela de users_projetos
    table.foreign(['id_user', 'id_projeto'])
        .references(['id_user', 'id_projeto'])
        .on('users_projetos');
        // relacionamento com a tabela de users_navers
    table.foreign(['id_user', 'id_naver'])
        .references(['id_user', 'id_naver'])
        .on('users_navers');
    // define uma chave primária
    table.primary(['id_user', 'id_projeto', 'id_naver']);
});

// exclusão
exports.down = knex => knex.schema.dropTable('users_projetos_navers');
