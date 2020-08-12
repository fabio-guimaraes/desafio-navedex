# Navedex API
---
## Descrição
API desenvolvida utilizando node.js para atender o desafio proposto pela empresa nave.rs
[https://github.com/naveteam/back-end-challenge](https://github.com/naveteam/back-end-challenge)

## Requisitos para execução

### Softwares necessários
Para executar e testar a API são necessários alguns softwares instalados e configurados no ambiente. Abaixo consta a relação dos aplicativos e versões utilizadas no ambiente que foi feito o desenvolvimento.

- Nodejs v10.22.0 (npm/npx v.6.14.6)
- Insomnia Core-2020.3.3
- Postgresql 10.13-2
- Visual Studio Code 1.47.3 *(opcional, editor utilizado para codificar)*

### Configurando o ambiente

#### Criando o banco de dados
A API foi criada utilizando o *Postgres* e o primeiro passo é a criação de um banco de dados chamado **navedex**. Dentro da pasta `docs/scripts` no repositório existe um arquivo chamado *create-dabase.sql* que realiza esse processo, basta copiar e colar o texto no editor SQL e executar.
```
CREATE DATABASE nevedex
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1;

COMMENT ON DATABASE nevedex
    IS 'Database desafio navers back-end'
```

#### Configurando a conexão
Na pasta raíz do projeto existe um arquivo chamado *knexfile.js* que contém as configurações de acesso ao banco de dados e devem ser alteradas, na seção *conection* caso as informações de conexão sejam diferentes.
```
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
```

### Executando a API

#### Instalando os pacotes
Executar o comando `npm install` dentro da pasta aonde encontram-se os arquivos da API. Isso fará com que todas as dependências sejam baixadas e instaladas. Esse processo pode ser um pouco demorado dependendo da velocidade da conexão com a internet.

#### Criando as tabelas
As tabelas devem ser criadas através do comando `npx knex migrate:latest`, que executará pelo knex as *migrations*, criando todas as tabelas e relacionamentos.

#### Inserindo dados de teste (opcional)
Para incluir dados iniciais de teste basta executar o comando `npx knex seed:run`. Se preferir pode pular essa etapa e criar todos os registros durante a execução da API.&nbsp;

Se incluir os dados pela API pode utilizar um dos usuários abaixo. A senha padrão para qualquer um dos usuários é `123456`.
- teste1@gmail.com
- teste2@outlook.com

### Execução
Para executar a API execute `npm start`. A execução será realizada através do *nodemon* que irá monitorar a aplicação na porta 3000.
```
> navedex@1.0.0 start C:\dev\navers\navedex
> nodemon src/server.js

[nodemon] 2.0.3
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json  
[nodemon] starting `node src/server.js`     
Servidor em execução
```

### Testando a API
Para realizar os testes será necessário a utilização de um software para executar as requisições. Durante o desenvolvimento foi utilizado o [insomnia](https://insomnia.rest/) e dentro da pasta `/docs/requests-insomnia` existe o arquivo *Insomnia_2020-08-11.json* com todas as rotas configuradas. Esse arquivo pode ser importado para o [insomnia](https://insomnia.rest/).

#### Executando as requisições
A partir do [insomnia](https://insomnia.rest/) e seguindo as informações do roteiro do desafio \([https://github.com/naveteam/back-end-challenge](https://github.com/naveteam/back-end-challenge)) será possível realizar todos os testes.
Algumas considerações sobre as requisições/testes:
- O token JWT gerado tem validade de um(1) dia. Se necessário esse valor pode ser alterado no arquivo `src/config.auth.json` alterando o valor da chave *expires*
- O token deve ser passado no cabeçalho (header) das requisições na propriedade `x-access-token`
- Para testar a roda *index* utilizando a opção de filtro
  - Projetos
    - Colocar o nome do projeto a ser filtrado diretamente depois do endereço da rota. Por exemplo, para se listar um projeto com o título "Teste Projeto" deve-se colocar `url_base/projetos/index/Teste Projeto`
  - Navers
    - Como no caso dos Navers existem três(3) opções de filtro, deve-se colocar depois do endereço da rota o par *campo=valor*, onde *campo* identifica qual o campo a ser usado no filtro (nome, cargo ou admissão) e *valor* informa qual o valor a ser usado na consulta. O exemplo a seguir lista os Navers que foram admitidos em 01/08/2020 `url_base/navers/index/admissao=2020-08-01`
- Diversas validações são realizadas antes de processar a requisição na base de dados e as mensagens de erro retornadas devem ser suficientes para o usuário identificar o problema e corrigir a solicitação

## Considerações
As bibliotecas utilizadas \(listadas abaixo) foram salvas no arquivo *package.json* com a versão exata para evitar qualquer erro de incompatibilidade com outras versões, sejam mais antigas ou mais novas.

## Dificuldades

As maiores dificuldades encontradas foram no uso de algumas bibliotecas por ser a primeira vez que utilizo, mas lendo a documentação e vendo alguns exemplos foi possível fazer toda a implementação. Outra questão foi com relação a sintaxe e comandos das verões mais atuais do javascript.&nbsp;

Por esses fatos talvez alguns trechos de código não estejam utilizando as melhores práticas, mas a API foi desenvolvida com todas as funcionalidades propostas no desafio.

## Referências

### Sites
- [https://nodejs.org/en/](https://nodejs.org/en/)
- [https://insomnia.rest/](https://insomnia.rest/)
- [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- [https://code.visualstudio.com/](https://code.visualstudio.com/)
- [https://express-validator.github.io/docs/](https://express-validator.github.io/docs/)
- [https://github.com/chriso/validator.js](https://github.com/chriso/validator.js)

### Artigos e vídeos
- https://www.youtube.com/watch?v=U7GjS3FuSkA
- https://www.notion.so/Masterclass-Knex-45d9705a634a4c2b80ac1599585163a6
- https://www.luiztools.com.br/post/como-usar-nodejs-mysql/
- https://www.luiztools.com.br/post/autenticacao-json-web-token-jwt-em-nodejs/

### Bibliotecas
Foram utilizadas as seguintes bibliotecas (pacotes) e suas respetivas versões:

| Biblioteca        | Versão |
|-------------------|--------|
| bcryptjs          | 2.4.3  |
| body-parser       | 1.19.0 |
| express           | 4.17.1 |
| express-validator | 6.6.0  |
| jsonwebtoken      | 8.5.1  |
| knex              | 0.21.2 |
| moment            | 2.24.0 |
| pg                | 8.3.0  |

## Conclusão
Foi gratificante ficar algumas horas estudando e desenvolvendo. Apesar dos problemas encontrados na utilização de tecnologias novas é muito bom ver o resultado final sendo executado e devolvendo o resultado esperado. Além do mais o conhecimento adquirido é de grande valor.&nbsp;

Chego ao final deste desafio feliz com o trabalho realizado.
