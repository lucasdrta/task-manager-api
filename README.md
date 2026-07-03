# Task Manager API

API REST para gerenciamento de tarefas (todolist), construída com Express, TypeScript e PostgreSQL.

## Funcionalidades

- CRUD de tarefas (listar, criar, atualizar status e deletar)
- Health check
- Documentação interativa com OpenAPI + Scalar
- Migrations com Drizzle ORM
- Graceful shutdown
- Ambiente de desenvolvimento com Docker e hot reload
- Testes com Vitest e Supertest

## Stack

- [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Vitest](https://vitest.dev/)
- [Scalar](https://scalar.com/) (API Reference)
- [Docker](https://www.docker.com/)

## Pré-requisitos

- Node.js 22+
- Yarn
- Docker e Docker Compose (recomendado para desenvolvimento)

## Início rápido (Docker)

```bash
# clonar o repositório
git clone https://github.com/lucasdrta/task-manager-api.git
cd task-manager-api

# subir API + PostgreSQL
yarn docker:dev
```

A API ficará disponível em `http://localhost:3333`.

Documentação interativa: `http://localhost:3333/docs`

## Desenvolvimento local (sem Docker)

```bash
yarn install
cp .env.example .env

# subir apenas o banco
yarn docker:up

# aplicar migrations
yarn db:migrate

# iniciar API com hot reload
yarn dev
```

## Variáveis de ambiente

| Variável       | Descrição                          | Padrão              |
| -------------- | ---------------------------------- | ------------------- |
| `PORT`         | Porta da API                       | `3333`              |
| `DATABASE_URL` | Connection string do PostgreSQL    | ver `.env.example`  |

## Scripts

| Comando            | Descrição                              |
| ------------------ | -------------------------------------- |
| `yarn dev`         | Desenvolvimento com hot reload         |
| `yarn build`       | Compila TypeScript para `dist/`        |
| `yarn start`       | Executa build de produção              |
| `yarn test`        | Roda os testes                         |
| `yarn docker:dev`  | Sobe stack completa com logs           |
| `yarn docker:up`   | Sobe stack em background               |
| `yarn docker:down` | Para os containers                     |
| `yarn docker:reset`| Remove volume de `node_modules`        |
| `yarn db:generate` | Gera migrations a partir do schema     |
| `yarn db:migrate`  | Aplica migrations                      |
| `yarn db:push`     | Sincroniza schema direto no banco      |
| `yarn db:studio`   | Abre Drizzle Studio                    |

## Endpoints

| Método   | Rota                  | Descrição                |
| -------- | --------------------- | ------------------------ |
| `GET`    | `/health`             | Health check             |
| `GET`    | `/tasks`              | Listar tarefas           |
| `POST`   | `/tasks`              | Criar tarefa             |
| `PATCH`  | `/tasks/:id/status`   | Atualizar status         |
| `DELETE` | `/tasks/:id`          | Deletar tarefa           |
| `GET`    | `/docs`               | Documentação Scalar      |
| `GET`    | `/docs/openapi.json`  | Spec OpenAPI             |

### Exemplos

```bash
# criar tarefa
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk", "description": "2L"}'

# listar tarefas
curl http://localhost:3333/tasks

# marcar como concluída
curl -X PATCH http://localhost:3333/tasks/1/status \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# deletar tarefa
curl -X DELETE http://localhost:3333/tasks/1
```

Também é possível testar as rotas pelo arquivo [`api.http`](./api.http) (REST Client) ou pela UI em `/docs`.

## Estrutura do projeto

```
src/
├── controllers/     # Camada HTTP
├── usecases/        # Regras de negócio
├── routes/          # Rotas Express
├── db/              # Drizzle (schema + client)
├── docs/            # OpenAPI spec
├── app.ts           # Configuração do Express
└── server.ts        # Servidor HTTP + graceful shutdown
tests/               # Testes com Vitest
drizzle/             # Migrations SQL
```

## Testes

```bash
yarn test
```

## Licença

Este projeto está sob a licença [MIT](LICENSE).
