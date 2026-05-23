# 01 - Setup Local

Este guia descreve como preparar o projeto para desenvolvimento local.

## Pre-requisitos

- Node.js compativel com o projeto.
- npm.
- Docker Desktop, se for usada a execucao recomendada por Docker.
- PostgreSQL local, apenas se o backend for executado fora do Docker.

## Estrutura base

```text
Projeto-Les---PL2-G8/
  backend/
  frontend/
  docker-compose.yml
```

## Execucao recomendada

A forma recomendada para a equipa e usar Docker Compose:

```powershell
cd c:\Users\gusta\Desktop\LES\Projeto-Les---PL2-G8
docker compose up --build
```

Isto sobe:

- PostgreSQL na porta `5432`.
- Backend NestJS na porta `3000`.
- Frontend Vue na porta `8080`.

## Backend local sem Docker

Se a base de dados ja estiver disponivel:

```powershell
cd backend
npm install
npx prisma generate
npx prisma db push
npm run start:dev
```

O backend usa por defeito a porta `3000`.

## Frontend local sem Docker

```powershell
cd frontend
npm install
npm run serve
```

O frontend Vue CLI fica normalmente em:

```text
http://localhost:8080
```

## Electron

O Docker executa o frontend em modo web. O modo desktop Electron deve ser executado no host:

```powershell
cd frontend
npm run electron:serve
```

Existe tambem um script na raiz:

```powershell
powershell -ExecutionPolicy Bypass -File .\run-electron-dev.ps1
```
