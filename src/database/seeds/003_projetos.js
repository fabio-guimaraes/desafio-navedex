// Inclui registros iniciais para testes
// Autor: Fábio Guimarães

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('projetos').del()
    .then(function () {
      // Inserts seed entries
      return knex('projetos').insert([
        { titulo: 'API Nodejs' },
        { titulo: 'Navedex' }
      ]);
    });
};
