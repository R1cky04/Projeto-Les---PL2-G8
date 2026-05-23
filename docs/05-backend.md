# 05 - Backend

O backend esta em:

```text
backend/
```

Tecnologias principais:

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- Swagger/OpenAPI
- Jest/Supertest

## Entrada

```text
backend/src/main.ts
```

Responsabilidades:

- Criar a aplicacao Nest.
- Ativar CORS.
- Ativar `ValidationPipe`.
- Configurar Swagger.
- Escutar na porta `3000` por defeito.

## Modulo raiz

```text
backend/src/app.module.ts
```

Importa os modulos funcionais:

- Auth
- Internal Users
- Stations
- Vehicles
- Impros
- Rentals
- Reservations
- Prisma

## Prisma

```text
backend/src/prisma/prisma.module.ts
backend/src/prisma/prisma.service.ts
```

Fornece o acesso a base de dados usando Prisma Client.

## Organizacao por modulo

Cada modulo segue a estrutura comum do NestJS:

```text
modulo/
  modulo.controller.ts
  modulo.service.ts
  modulo.module.ts
  dto/
  *.guard.ts
```

Exemplos:

- `station/`
- `vehicle/`
- `auth/`
- `internal-users/`
- `reservations/`
- `rentals/`
- `impro/`

## Validacao

O backend usa:

- `class-validator`
- `class-transformer`
- `ValidationPipe` global

Os DTOs definem contratos de entrada para criacao, atualizacao e operacoes especificas.

## Swagger

Configurado em:

```text
backend/src/swagger.ts
```

URLs:

```text
http://localhost:3000/api/docs
http://localhost:3000/api/docs-json
```

## Comandos

```powershell
cd backend
npm install
npm run start:dev
npm run build
npm run test
npm run test:e2e
```

## Prisma

```powershell
npx prisma generate
npx prisma db push
npm run migrate:status
```
