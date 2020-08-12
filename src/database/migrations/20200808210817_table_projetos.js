// Tabela de projetos
// Autor: Fábio Guimarães

// criação
exports.up = knex => knex.schema.createTable('projetos', table => {
    table.increments('id');
    table.text('titulo').notNullable();
});

// exclusão
exports.down = knex => knex.schema.dropTable('projetos');
