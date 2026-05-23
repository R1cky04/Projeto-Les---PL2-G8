# 02 - Docker

O projeto inclui `docker-compose.yml` na raiz e esta preparado para correr em desenvolvimento com tres servicos.

## Servicos

### db

- Imagem: `postgres:16`
- Container: `pl2g8-db`
- Porta: `5432`
- Base de dados: `pl2g8`
- Utilizador: `postgres`
- Password: `postgres`

### backend

- Container: `pl2g8-backend`
- Porta: `3000`
- Framework: NestJS
- Comando no arranque:

```sh
npm install && npx prisma generate && npx prisma db push && npm run start:dev
```

O backend espera pela base de dados ficar saudavel antes de arrancar.

### frontend

- Container: `pl2g8-frontend`
- Porta: `8080`
- Framework: Vue CLI
- Comando no arranque:

```sh
npm install && npm run serve -- --host 0.0.0.0 --port 8080
```

## Subir o ambiente

```powershell
docker compose up --build
```

Em segundo plano:

```powershell
docker compose up --build -d
```

## Ver estado

```powershell
docker compose ps
```

ou:

```powershell
docker ps
```

## Ver logs

Todos os servicos:

```powershell
docker compose logs -f
```

Servico especifico:

```powershell
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```

## Reiniciar um servico

```powershell
docker compose restart backend
docker compose restart frontend
```

## Parar

```powershell
docker compose down
```

## Reset completo da base de dados

Este comando remove tambem os volumes:

```powershell
docker compose down -v
```

Usar apenas quando for aceitavel perder os dados locais.
