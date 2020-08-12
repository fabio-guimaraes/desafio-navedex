// Tabela de usuários
// Autor: Fábio Guimarães

// criação
exports.up = knex => knex.schema.createTable('users', table => {
    table.increments('id');
    table.text('email').unique().notNullable();
    table.text('senha').notNullable();
});

// exclusão
exports.down = knex => knex.schema.dropTable('users');
