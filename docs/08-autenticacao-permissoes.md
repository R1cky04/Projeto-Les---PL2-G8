# 08 - Autenticacao e Permissoes

O sistema inclui autenticacao interna com sessoes e permissoes por perfil.

## Modulo de autenticacao

Localizacao:

```text
backend/src/auth/
```

Ficheiros relevantes:

- `auth.controller.ts`
- `auth.service.ts`
- `auth-session.guard.ts`
- `auth-token.service.ts`
- `auth-feature-policy.ts`
- `auth-bootstrap.service.ts`
- `login.dto.ts`

## Login

Endpoint:

```text
POST /auth/login
```

O login recebe credenciais internas e devolve estado do utilizador, sessao e funcionalidades disponiveis.

## Sessao

As sessoes sao guardadas na tabela `InternalSession`.

Campos importantes:

- `tokenId`
- `tokenHash`
- `userId`
- `lastSeenAt`
- `expiresAt`
- `revokedAt`

## Token

Os pedidos protegidos usam:

```http
Authorization: Bearer <token>
```

## Perfis internos

Definidos no Prisma:

- `IT`
- `ADMIN`
- `STAFF`
- `FLEET`

## Permissoes internas

Exemplos definidos no schema:

- `RESERVATION_READ`
- `RENTAL_READ`
- `VEHICLE_READ`
- `VEHICLE_WRITE`
- `MAINTENANCE_WRITE`
- `TRANSFER_WRITE`
- `INCIDENT_WRITE`
- `USER_READ`
- `USER_CREATE`
- `USER_ACTIVATE`

## Regras visiveis no frontend

No `InternalWorkspaceHome.vue` e `InternalPortalView.vue` existem regras de acesso aos modulos:

- Estacoes: apenas `IT`.
- Impros: `FLEET`, `ADMIN` ou `IT`.
- Veiculos: `IT`, `ADMIN`, `STAFF` ou `FLEET`.
- Contratos: `IT`, `ADMIN`, `STAFF` ou `FLEET`.
- Reservas: `IT`, `ADMIN`, `STAFF` ou `FLEET`.

## Guards backend

Exemplos:

- `auth-session.guard.ts`
- `it-station-management.guard.ts`
- `vehicle-management.guard.ts`
- `reservation-management.guard.ts`
- `rental-management.guard.ts`
- `impro.guard.ts`
- `it-master.guard.ts`

Estes guards protegem endpoints e garantem que apenas perfis autorizados executam determinadas operacoes.
