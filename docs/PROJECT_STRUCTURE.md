# Project Structure

This repository is organized around two active applications and a small set of supporting folders.

## Active Areas

```text
.
├── backend/        # NestJS API + Prisma schema/migrations
├── frontend/       # Vue 3 + Electron desktop app
├── docs/           # Project documentation and architecture notes
├── docker-compose.yml
├── run-electron-dev.ps1
└── README.md
```

## Backend Layout

The backend follows a feature-oriented layout:

```text
backend/src/
├── auth/           # Authentication, session bootstrap, guards and token handling
├── catalog/        # Normalized vehicle catalog (make/model/variant)
├── impro/          # Vehicle incident / transfer workflows
├── internal-users/ # Internal account management
├── prisma/         # Prisma service and bootstrap
├── rentals/        # Rental contract logic
├── reservations/   # Reservation logic
├── station/        # Station management
├── vehicle/        # Vehicle management
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── main.ts
└── swagger.ts
```

The Prisma schema lives in [backend/prisma/schema.prisma](../backend/prisma/schema.prisma).

## Frontend Layout

The frontend is also split by domain:

```text
frontend/src/
├── components/
│   ├── auth/            # Login/workspace screens
│   ├── impro/           # Impro and history screens
│   ├── internal-users/  # Internal user administration
│   ├── rentals/         # Rental contract screens
│   ├── reservations/    # Reservation screens
│   ├── station/         # Station create/manage screens
│   └── vehicle/         # Vehicle create/manage screens
├── constants/           # Shared static data and catalogs
├── services/            # API client, i18n and app services
├── styles/              # Global and feature styles
├── utils/               # Small reusable helpers
├── views/               # High-level routing shells and portal container
├── App.vue
├── background.js
└── main.js
```

## What To Ignore

These folders are kept for compatibility or historical reasons and are not part of the day-to-day flow:

- `backend-simple/` is currently empty.
- `backend/src/prisma.bak/` is a legacy Prisma backup.
- `backend/src/generated/prisma/` and `backend/generated/prisma/` are generated clients.
- `frontend/dist_electron/` and `frontend/dist/` are build outputs.
- `frontend/src/components/HelloWorld.vue` has been removed because it was unused.

## Mental Model

- Use `backend/` for API and data rules.
- Use `frontend/` for the UI and Electron shell.
- Use `docs/` for everything that explains the project.
- Keep generated and legacy outputs out of feature work unless you are updating the toolchain.
