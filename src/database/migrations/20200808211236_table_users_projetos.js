// Tabela de relação de projetos pertencentes a um usuário
// Autor: Fábio Guimarães

// criação
exports.up = knex => knex.schema.createTable('users_projetos', table => {
    // relacionamento com a tabela de usuários
    table.integer('id_user')
        .references('users.id')
        .notNullable();
    // relacionamento com a tabela de projetos
    table.integer('id_projeto')
        .references('projetos.id')
        .notNullable();
    table.primary(['id_user', 'id_projeto']);
});

// exclusão
exports.down = knex => knex.schema.dropTable('users_projetos');