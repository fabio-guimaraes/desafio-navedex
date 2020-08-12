// Tabela de relação de navers pertencentes a um usuário
// Autor: Fábio Guimarães

// criação
exports.up = knex => knex.schema.createTable('users_navers', table => {
    // relacionamento com a tabela de usuários
    table.integer('id_user')
        .references('users.id')
        .notNullable();
    // relacionamento com a tabela de navers
    table.integer('id_naver')
        .references('navers.id')
        .notNullable();
    table.primary(['id_user', 'id_naver']);
});

// exclusão
exports.down = knex => knex.schema.dropTable('users_navers');
