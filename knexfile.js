// Arquivo de configuração da conexão com o banco de dados Postgres
// Configura novo diretório para arquivos das migrations e seeds
// Autor: Fábio Guimarães

module.exports = {

  development: {
    client: 'pg',
    connection: {
      hostname: "localhost",
      port: 5432,
      database: "navedex",
      user: "postgres",
      password: "admin"
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${__dirname}/src/database/migrations`
    },
    seeds: {
      directory: `${__dirname}/src/database/seeds`
    }
  }
};
