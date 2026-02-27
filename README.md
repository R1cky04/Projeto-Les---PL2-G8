# Projeto-Les---PL2-G8

Monorepo com:

- `backend`: NestJS + Prisma
- `frontend`: Vue (Vue CLI/Webpack) + Electron

## Docker (recomendado para equipa)

Pré-requisito: Docker Desktop instalado.

Subir tudo (Postgres + Backend + Frontend web):

```bash
docker compose up --build
```

Parar tudo:

```bash
docker compose down
```

Parar e remover volume do banco:

```bash
docker compose down -v
```

Endpoints:

- Frontend (Vue web): http://localhost:8080
- Backend (Nest): http://localhost:3000
- Postgres: localhost:5432 (`postgres/postgres`, db `pl2g8`)

Observação: o Electron em modo desktop (`electron:serve`/`electron:build`) deve ser executado localmente no host, não dentro do container.

## Estrutura

```
.
├── docker-compose.yml
├── backend/
└── frontend/
```

## Backend (NestJS + Prisma)

```bash
cd backend
npm install
npx prisma generate
npm run start:dev
```

Build:

```bash
npm run build
```

## Frontend (Vue + Electron)

```bash
cd frontend
npm install
npm run electron:serve
```

Build web (Vue CLI):

```bash
npm run build
```

Build desktop (Electron):

```bash
npm run electron:build
```
