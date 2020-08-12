// Inclui registros iniciais para testes

// importa bcrypt para criptografar/descriptografar as senhas
const bcrypt = require('bcryptjs');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(async function () {
      // Gera uma senha padrão "123456" encriptada para todos usuários
      const pwd = await bcrypt.hash('123456', 10);

      // Inserts seed entries
      return knex('users').insert([
        { email: 'teste1@gmail.com', senha: pwd },
        { email: 'teste2@outlook.com', senha: pwd }
      ]);
    });
};
