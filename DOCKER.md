# Docker Setup

Este projeto está preparado para correr em Docker com 3 serviços:

- `db` (PostgreSQL 16)
- `backend` (NestJS + Prisma)
- `frontend` (Vue CLI em modo web para desenvolvimento)

## Pré-requisitos

- Docker Desktop instalado e em execução
- Portas livres:
  - `3000` (backend)
  - `5432` (postgres)
  - `8080` (frontend)

## Subir tudo

Na raiz do projeto:

```bash
docker compose up --build
```

## Ver logs

```bash
docker compose logs -f
```

Logs de um serviço específico:

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

## Parar tudo

```bash
docker compose down
```

## Reset completo (inclui base de dados)

```bash
docker compose down -v
```

## Endpoints

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Postgres:
  - Host: `localhost`
  - Porta: `5432`
  - User: `postgres`
  - Password: `postgres`
  - Database: `pl2g8`

## Prisma

O backend já executa automaticamente no arranque do container:

1. `npx prisma generate`
2. `npx prisma db push`
3. `npm run start:dev`

## Nota sobre Electron

O Electron desktop não é executado no container (fluxo normal em Docker para equipas).

Se quiseres empacotar/rodar Electron localmente no host:

```bash
cd frontend
npm run electron:serve
npm run electron:build
```

## Problemas comuns

### Porta em uso

Altera a porta no `docker-compose.yml` ou fecha o processo que está a usar a porta.

### Containers antigos / cache

```bash
docker compose down -v
docker compose up --build
```

### Dependências inconsistentes

```bash
docker compose down
docker volume prune -f
docker compose up --build
```
