// Inclui registros iniciais para testes
// Autor: Fábio Guimarães

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users_projetos').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_projetos').insert([
        { id_user: 1, id_projeto: 1 },
        { id_user: 2, id_projeto: 2 }
      ]);
    });
};
