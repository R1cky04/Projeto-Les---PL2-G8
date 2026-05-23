# 03 - Arquitetura

O projeto segue uma arquitetura em monorepo com frontend, backend e base de dados separados.

## Visao geral

```text
Browser / Electron
      |
      v
Frontend Vue 3
      |
      | HTTP JSON
      v
Backend NestJS
      |
      | Prisma Client
      v
PostgreSQL
```

## Camadas

### Frontend

Responsavel pela interface do portal interno:

- Login e logout.
- Painel interno.
- Gestao de estacoes.
- Gestao de veiculos.
- Gestao de utilizadores internos.
- Reservas.
- Contratos.
- Impros/operacoes de frota.

### Backend

Responsavel pelas regras de negocio e exposicao da API:

- Autenticacao interna.
- Permissoes por perfil.
- CRUD de estacoes e veiculos.
- Gestao de utilizadores internos.
- Reservas e contratos.
- Impros/transferencias/incidentes.
- Integracao com Prisma/PostgreSQL.

### Base de dados

PostgreSQL com Prisma como camada ORM.

## Modulos backend

Configurados em `backend/src/app.module.ts`:

- `PrismaModule`
- `AuthModule`
- `StationModule`
- `VehicleModule`
- `InternalUsersModule`
- `ImproModule`
- `RentalModule`
- `ReservationModule`

## Comunicacao frontend-backend

O frontend usa pedidos HTTP JSON para o backend. O cliente partilhado esta em:

```text
frontend/src/services/apiClient.js
```

URL base por defeito:

```text
http://127.0.0.1:3000
```

Pode ser alterada pela variavel:

```text
VUE_APP_API_BASE_URL
```

## Documentacao da API

O backend configura Swagger em:

```text
backend/src/swagger.ts
```

URLs:

- Swagger UI: `/api/docs`
- Swagger JSON: `/api/docs-json`
