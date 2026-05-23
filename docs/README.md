# Documentacao do Projeto PL2-G8

Este diretorio concentra a documentacao tecnica do projeto **Projeto-Les---PL2-G8**.

O projeto e um monorepo com:

- **Frontend**: Vue 3, Vue CLI/Webpack e suporte Electron.
- **Backend**: NestJS, Prisma e PostgreSQL.
- **Infraestrutura local**: Docker Compose com PostgreSQL, backend e frontend.

## Indice

- [01 - Setup Local](./01-setup-local.md)
- [02 - Docker](./02-docker.md)
- [03 - Arquitetura](./03-arquitetura.md)
- [04 - Frontend](./04-frontend.md)
- [05 - Backend](./05-backend.md)
- [06 - API](./06-api.md)
- [07 - Base de Dados](./07-base-de-dados.md)
- [08 - Autenticacao e Permissoes](./08-autenticacao-permissoes.md)
- [09 - Testes](./09-testes.md)
- [10 - Guia de Validacao](./10-guia-validacao.md)

## Endpoints principais

Com Docker ativo:

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Swagger UI: http://localhost:3000/api/docs
- Swagger JSON: http://localhost:3000/api/docs-json
- PostgreSQL: `localhost:5432`

## Comando rapido

Na raiz do projeto:

```powershell
docker compose up --build
```

Para parar:

```powershell
docker compose down
```
