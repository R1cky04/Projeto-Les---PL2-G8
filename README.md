# Projeto-Les---PL2-G8

Monorepo com:

- `backend`: NestJS + Prisma
- `frontend`: Vue (Vue CLI/Webpack) + Electron

## Estrutura

```
.
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
