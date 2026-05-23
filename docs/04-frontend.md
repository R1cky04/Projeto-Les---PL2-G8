# 04 - Frontend

O frontend esta em:

```text
frontend/
```

Tecnologias principais:

- Vue 3
- Vue CLI/Webpack
- JavaScript
- Electron para modo desktop
- Jest para testes

## Entrada da aplicacao

```text
frontend/src/main.js
```

Este ficheiro cria a aplicacao Vue, regista o plugin de i18n e monta o `App.vue`.

```text
frontend/src/App.vue
```

O `App.vue` renderiza o `InternalPortalView`.

## View principal

```text
frontend/src/views/InternalPortalView.vue
```

Responsabilidades:

- Restaurar/limpar sessao.
- Login/logout.
- Guardar estado autenticado.
- Controlar qual modulo esta aberto.
- Encaminhar para componentes como estacoes, veiculos, reservas, contratos, impros e utilizadores internos.

## Painel interno

```text
frontend/src/components/auth/InternalWorkspaceHome.vue
```

Responsavel por mostrar:

- Utilizador autenticado.
- Estado da sessao.
- Avisos da sessao.
- Cartoes de funcionalidades.
- Botoes para abrir modulos.

## Componentes principais

- `components/CreateStation.vue`
- `components/ManageStation.vue`
- `components/CreateVehicle.vue`
- `components/ManageVehicle.vue`
- `views/InternalUsersView.vue`
- `components/reservations/ManageReservations.vue`
- `components/rentals/RentalContractsView.vue`
- `components/impro/ImproOperationsView.vue`

## Services

Os services encapsulam chamadas HTTP e regras auxiliares:

- `services/apiClient.js`: cliente HTTP JSON partilhado.
- `services/authApi.js`: login, logout e sessao.
- `services/internalUsersApi.js`: utilizadores internos.
- `services/reservationsApi.js`: reservas.
- `services/rentalsApi.js`: contratos.
- `services/improApi.js`: impros.
- `services/i18n.js`: traducoes e idioma.

## Internacionalizacao

O ficheiro principal e:

```text
frontend/src/services/i18n.js
```

Idiomas suportados:

- `pt`
- `en`
- `es`

As traducoes sao acedidas nos componentes com:

```vue
{{ $t('chave.da.traducao') }}
```

## Estilos

Os estilos estao em:

```text
frontend/src/styles/
```

O ficheiro `frontend/src/styles/index.css` e importado no `main.js`.

## Comandos

```powershell
cd frontend
npm install
npm run serve
npm run build
npm run test
npm run electron:serve
```
