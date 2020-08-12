// Tabela de navers
// Autor: Fábio Guimarães

// criação
exports.up = knex => knex.schema.createTable('navers', table => {
    table.increments('id');
    table.text('nome').notNullable();
    table.date('nascimento');
    table.date('admissao');
    table.text('cargo');
});

// exclusão
exports.down = knex => knex.schema.dropTable('navers');
