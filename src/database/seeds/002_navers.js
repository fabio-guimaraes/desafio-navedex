// Inclui registros iniciais para testes
// Autor: Fábio Guimarães

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('navers').del()
    .then(function () {
      // Inserts seed entries
      return knex('navers').insert([
        { nome: 'Fabio', nascimento: '1966-07-03', admissao: '2001-02-16', cargo: 'Dev back-end' },
        { nome: 'Ramis', nascimento: '1990-10-22', admissao: '2005-09-01', cargo: 'Analista de sistemas' },
        { nome: 'Mateus', nascimento: '1990-09-06', admissao: '2020-07-15', cargo: 'Dev Senior' },
        { nome: 'Wagner', nascimento: '1983-02-17', admissao: '2020-08-01', cargo: 'Prof' },
      ]);
    });
};
