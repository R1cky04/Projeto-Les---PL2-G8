# 10 - Guia de Validacao

Este guia ajuda a preparar alteracoes pequenas que podem ser pedidas numa validacao oral/pratica.

## Objetivo

Demonstrar que a equipa sabe:

- Encontrar o ficheiro certo.
- Fazer uma alteracao pequena.
- Guardar e deixar o servidor recompilar.
- Validar no browser ou por endpoint.
- Explicar o impacto da alteracao.

## Exemplos frontend

### Alterar texto de um botao

Exemplo:

- Trocar `Criar estacao` por `Nova estacao`.

Locais provaveis:

- Texto de navegacao: `frontend/src/services/i18n.js`
- Renderizacao do botao: `frontend/src/views/InternalPortalView.vue`

Validacao:

- Abrir http://localhost:8080
- Fazer login.
- Ir ao modulo onde o botao aparece.

### Alterar ordem de nome

Exemplo:

- Antes: `Primeiro Nome Ultimo Nome`
- Depois: `Ultimo Nome, Primeiro Nome`

Como procurar:

```powershell
rg -n "firstName|lastName|fullName" frontend/src
```

### Reduzir funcionalidades de um botao

Exemplo:

- Um botao que fazia abrir modal e submeter passa a apenas abrir modal.

Como procurar:

```powershell
rg -n "@click|submit|open" frontend/src
```

Validar no browser se apenas a acao pretendida acontece.

## Exemplos backend

### Alterar mensagem do endpoint raiz

Ficheiros:

- `backend/src/app.controller.ts`
- `backend/src/app.service.ts`

Validacao:

```text
http://localhost:3000
```

### Criar endpoint simples

Exemplo:

```ts
@Get('status')
getStatus() {
  return { message: 'Sistema operacional' };
}
```

Validacao:

```text
http://localhost:3000/status
```

### Ajustar resposta de listagem

Exemplo:

- Mudar ordenacao.
- Adicionar campo calculado.
- Alterar formato de uma string.

Como procurar:

```powershell
rg -n "findMany|orderBy|map" backend/src
```

## Exemplo frontend + backend

### Mostrar estado do sistema no frontend

Backend:

- Criar `GET /status`.

Frontend:

- Chamar `fetch('http://127.0.0.1:3000/status')`.
- Guardar a resposta numa variavel.
- Mostrar com `{{ systemMessage }}`.

Validacao:

1. Confirmar backend em `http://localhost:3000/status`.
2. Confirmar frontend em `http://localhost:8080`.

## Como interpretar erros comuns

### Erro de build no Vue

Se aparecer:

```text
Module build failed
```

Significa que o frontend nao compilou.

Se mencionar:

```text
InternalPortalView.vue?vue&type=script&lang=js
```

O erro esta no `<script>` desse ficheiro.

Depois deve-se rever:

- Virgulas entre metodos.
- Chavetas `{}`.
- Parenteses `()`.
- Nomes de variaveis.

### Backend demora a responder apos restart

Apos:

```powershell
docker compose restart backend
```

O backend pode demorar porque executa:

- `npm install`
- `prisma generate`
- `prisma db push`
- `nest start --watch`

Esperar pela mensagem:

```text
Nest application successfully started
```

## Comandos rapidos

```powershell
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
docker compose restart backend
docker compose restart frontend
```
