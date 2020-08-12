// Inclui registros iniciais para testes
// Autor: Fábio Guimarães

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users_projetos_navers').del()
    .then(function () {
      // Inserts seed entries
      return knex('users_projetos_navers').insert([
        { id_user: 1, id_projeto: 1, id_naver: 1 },
        { id_user: 1, id_projeto: 1, id_naver: 2 },
        { id_user: 2, id_projeto: 2, id_naver: 3 },
        { id_user: 2, id_projeto: 2, id_naver: 4 }
      ]);
    });
};
