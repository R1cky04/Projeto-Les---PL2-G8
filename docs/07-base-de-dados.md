# 07 - Base de Dados

A base de dados e PostgreSQL e o acesso e feito atraves de Prisma.

## Ficheiro principal

```text
backend/prisma/schema.prisma
```

## Provider

```prisma
datasource db {
  provider = "postgresql"
}
```

A URL e fornecida por ambiente. Em Docker:

```text
postgresql://postgres:postgres@db:5432/pl2g8?schema=public
```

## Geradores Prisma

O schema gera:

- Cliente Prisma padrao.
- Cliente adicional em `backend/generated/prisma`.

## Entidades principais

### User

Representa utilizadores internos. Inclui:

- `userId`
- `email`
- `passwordHash`
- `fullName`
- `isInternal`
- `internalRole`
- `internalStatus`
- `permissions`

### InternalSession

Guarda sessoes internas ativas com token hash, datas e revogacao.

### Station

Representa estacoes/pontos de levantamento e devolucao.

Campos importantes:

- `name`
- `code`
- `addressLine1`
- `city`
- `country`
- `isActive`
- `isPickupPoint`
- `isReturnPoint`

### Vehicle

Representa veiculos da frota.

Campos importantes:

- `plateNumber`
- `brand`
- `model`
- `stationId`
- `dailyRate`
- `status`
- `odometerKm`

### CustomerProfile

Representa clientes registados ou sem login.

### Reservation

Representa reservas com cliente, estacoes, datas e veiculo opcional.

### Rental

Representa contratos de aluguer, com estado, valores, viatura e cliente.

### Payment

Representa pagamentos associados a alugueres.

### VehicleMaintenance

Representa manutencoes de veiculos.

### VehicleTransfer

Representa transferencias de veiculos entre estacoes.

### VehicleImpro

Representa impros/incidentes/ocorrencias de veiculos.

## Enums principais

- `InternalUserRole`: `IT`, `ADMIN`, `STAFF`, `FLEET`
- `InternalUserStatus`: `ACTIVE`, `PENDING_IT_VALIDATION`, `BLOCKED`
- `VehicleStatus`: `AVAILABLE`, `RESERVED`, `RENTED`, `MAINTENANCE`, `INACTIVE`
- `ReservationStatus`: `DRAFT`, `CONFIRMED`, `CANCELLED`, `COMPLETED`, `NO_SHOW`
- `RentalStatus`: `OPEN`, `CLOSED`, `CANCELLED`
- `VehicleImproStatus`: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CANCELLED`

## Comandos uteis

```powershell
cd backend
npx prisma generate
npx prisma db push
npm run migrate:status
```
