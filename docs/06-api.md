# 06 - API

A API e exposta pelo backend NestJS em:

```text
http://localhost:3000
```

A documentacao interativa esta em:

```text
http://localhost:3000/api/docs
```

## Autenticacao

Endpoints:

- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`

O login devolve um token de sessao interna. Os endpoints protegidos recebem:

```http
Authorization: Bearer <token>
```

## Estacoes

Base path:

```text
/stations
```

Endpoints:

- `POST /stations`
- `GET /stations`
- `GET /stations/:id`
- `GET /stations/search/:searchTerm`
- `PUT /stations/:id`
- `DELETE /stations/:id`

## Veiculos

Base path:

```text
/vehicles
```

Endpoints:

- `POST /vehicles`
- `GET /vehicles`
- `GET /vehicles/:id`
- `GET /vehicles/search/:searchTerm`
- `PUT /vehicles/:id`
- `DELETE /vehicles/:id`

## Utilizadores internos

Base path:

```text
/internal-users
```

Endpoints:

- `POST /internal-users`
- `GET /internal-users`
- `PUT /internal-users/:id`
- `DELETE /internal-users/:id`

## Reservas

Base path:

```text
/reservations
```

Endpoints:

- `GET /reservations/context`
- `GET /reservations/availability`
- `GET /reservations`
- `GET /reservations/:id`
- `POST /reservations`
- `PATCH /reservations/:id`
- `PATCH /reservations/:id/cancel`

## Contratos de aluguer

Base path:

```text
/rentals
```

Endpoints:

- `GET /rentals/context`
- `GET /rentals`
- `GET /rentals/:id`
- `POST /rentals`
- `PATCH /rentals/:id`
- `PATCH /rentals/:id/close`

## Impros

Base path:

```text
/impros
```

Endpoints:

- `GET /impros/vehicles`
- `GET /impros/stations`
- `POST /impros`
- `GET /impros`
- `PATCH /impros/:id`
- `POST /impros/:id/close`

## Endpoint raiz

O `AppController` expõe o endpoint raiz:

- `GET /`

Durante validacoes simples, pode ser usado para demonstrar alteracoes de backend.

## Status customizado

Se for mantido o exercicio feito em aula, pode existir tambem:

- `GET /status`

Resposta esperada:

```json
{
  "message": "Sistema operacional"
}
```
