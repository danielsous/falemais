
# Índice
- [Sobre](#sobre)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Usar](#como-usar)

<a id="sobre"></a>
## :bookmark: Sobre

FaleMais é uma ferramenta de planos no qual possibilita o cliente calcular quanto irá gastar por mês baseado no seu consumo estimado e seu plano de dados.
<br>

<a id="tecnologias-utilizadas"></a>
## :rocket: Tecnologias utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias
- [Node.js](https://nodejs.org/en/)

<br/>

<a id="como-usar"></a>
## :fire: Como usar
- ### **Pré-requisitos**
  - **[Node.js](https://nodejs.org/en/)**
  - Gerenciador de pacotes seja o **[NPM](https://www.npmjs.com/)** ou **[Yarn](https://yarnpkg.com/)**.
  - **Docker**
  - **PostgreSQL**

1. Inicitar repositorio para funcionamento do Jest combinado com Husky
```sh
  $ git init
```
2. Realize a configuração do Docker:
```sh
  # Configurar nome de usuário e senha do banco de dados nos seguintes arquivos.
  ~/.circlecli/config.yml
  ## Editando no seguinte bloco:
  docker:
      - image: node:10
        environment:
          DATABASE_URL: 'postgres://postgres@localhost:5432/falemais_test'
      - image: postgres:10.6-alpine
        environment:
          POSTGRES_USER: postgres
          POSTGRES_DB: falemais_test
```
3. Realize a configuração do Sequelize:
```sh
  # Editar dados da conexão:
  ~/config/config.js
```
4. Executando a Aplicação:
```sh
  # Instale as dependências
  $ npm install
  
  ## Crie o banco de dados
  $ npx sequelize db:migrate
  
  ### Realizar inserção dos valores no banco de dados
  INSERT INTO plan (id, plan, minutes) values(1, 'FaleMais 30', 30);
  INSERT INTO plan (id, plan, minutes) values(2, 'FaleMais 60', 60);
  INSERT INTO plan (id, plan, minutes) values(3, 'FaleMais 120', 120);
  
  INSERT INTO tax (origin, destine, tax) values ('011', '016', 1.90);
  INSERT INTO tax (origin, destine, tax) values ('011', '017', 1.70);
  INSERT INTO tax (origin, destine, tax) values ('011', '018', 0.90);
  INSERT INTO tax (origin, destine, tax) values ('016', '011', 2.90);
  INSERT INTO tax (origin, destine, tax) values ('017', '011', 2.70);
  INSERT INTO tax (origin, destine, tax) values ('018', '011', 1.90);
  
  # Inicie a API
  $ npm run dev
```
<br>

<br>

## :mortar_board: Referências
Projeto desenvolvido por **[Daniel Rodrigues Sousa](https://github.com/lukyo17)**.
