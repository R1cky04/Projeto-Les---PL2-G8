# 09 - Testes

O projeto tem testes no backend e no frontend.

## Backend

Framework:

- Jest
- Supertest para e2e

Comandos:

```powershell
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

Testes unitarios ficam principalmente em:

```text
backend/src/**/*.spec.ts
```

Testes e2e ficam em:

```text
backend/test/
```

Exemplos encontrados:

- `auth.contract.e2e-spec.ts`
- `stations.contract.e2e-spec.ts`
- `vehicles.contract.e2e-spec.ts`
- `reservations.contract.e2e-spec.ts`
- `rentals.contract.e2e-spec.ts`
- `impros.contract.e2e-spec.ts`
- `internal-users.contract.e2e-spec.ts`
- `swagger.contract.e2e-spec.ts`

## Frontend

Framework:

- Jest

Comandos:

```powershell
cd frontend
npm run test
```

Testes encontrados:

- `services/apiClient.spec.js`
- `services/authApi.spec.js`
- `services/authStorage.spec.js`
- `services/internalUsersApi.spec.js`
- `services/reservationsApi.spec.js`
- `utils/loginForm.spec.js`
- `utils/reservationCreation.spec.js`
- `utils/authPresentation.spec.js`
- `utils/internalUserPresentation.spec.js`
- `utils/internalUserManagementForm.spec.js`

## Validacao manual rapida

Com Docker ativo:

1. Abrir frontend: http://localhost:8080
2. Fazer login.
3. Abrir modulos principais.
4. Confirmar chamadas ao backend no DevTools.
5. Abrir Swagger: http://localhost:3000/api/docs

## Diagnostico comum

Se o frontend mostrar erro de build:

- Verificar o ficheiro indicado no erro.
- Confirmar se o erro e em `template`, `script` ou `style`.
- Rever as ultimas alteracoes.
- Em Vue Options API, confirmar virgulas entre metodos dentro de `methods`.

Se o backend nao responder:

```powershell
docker compose logs -f backend
docker compose ps
```

Procurar:

```text
Nest application successfully started
```
