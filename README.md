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

### Script unico para testar com Electron

Na raiz do projeto, executa:

powershell -ExecutionPolicy Bypass -File .\run-electron-dev.ps1

O script sobe `db` + `backend` via Docker Compose e depois arranca o Electron no frontend.

Se ja tiveres dependencias instaladas no frontend e quiseres acelerar:

powershell -ExecutionPolicy Bypass -File .\run-electron-dev.ps1 -SkipInstall

## Estrutura

```
.
├── docker-compose.yml
├── backend/
└── frontend/
```

## Backend (NestJS + Prisma)

Se fores correr localmente fora do Docker, garante primeiro que tens uma base de dados PostgreSQL ativa.

Podes subir só a base de dados com Docker:

```bash
docker compose up -d db
```

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

Build:

```bash
npm run build
```

## Frontend (Vue + Electron)

Modo web (Vue CLI):

```bash
cd frontend
npm install
npm run serve
```

Modo desktop (Electron):

```bash
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
