# Guia de Teste da Aplicacao

Este guia descreve como obter e iniciar o projeto para avaliacao apos um `git clone`.

## Requisitos

Para testar a aplicacao no browser:

- Git
- Docker Desktop aberto e em execucao

Para testar tambem a aplicacao desktop Electron:

- Node.js instalado, alem dos requisitos anteriores

## 1. Clonar o projeto

Abrir o PowerShell numa pasta de trabalho e executar:

```powershell
git clone https://github.com/gustavo5506/Projeto-Les---PL2-G8.git
cd Projeto-Les---PL2-G8
```

Este procedimento assume que a versao final da aplicacao se encontra na branch
principal `main`, que e descarregada por omissao pelo `git clone`.

## 2. Iniciar a aplicacao com Docker

Com o Docker Desktop ativo, executar na raiz do projeto:

```powershell
docker compose up --build
```

No primeiro arranque, o Docker descarrega imagens, instala dependencias e prepara
a base de dados. Este processo pode demorar alguns minutos.

Quando os servicos estiverem ativos, abrir:

- Aplicacao web: http://localhost:8080
- API backend: http://localhost:3000
- Documentacao Swagger da API: http://localhost:3000/api/docs

## 3. Entrar na aplicacao

Em ambiente de teste/desenvolvimento, o backend cria automaticamente a conta
inicial de IT se ela ainda nao existir.

Credenciais:

```text
Utilizador: it.master
Password: ItMaster1!
```

## 4. Parar a aplicacao

Se o comando `docker compose up --build` estiver aberto no terminal, pressionar
`Ctrl+C`.

Depois executar na raiz do projeto:

```powershell
docker compose down
```

Este comando para os containers, mas preserva os dados criados durante o teste.

## 5. Repor a base de dados do zero

Executar apenas se for necessario apagar todos os dados de teste e voltar ao
estado inicial:

```powershell
docker compose down -v
docker compose up --build
```

O novo arranque volta a criar a conta `it.master`.

## Opcional: Abrir Como Aplicacao Desktop

O modo principal de avaliacao pode ser feito no browser. Para abrir a interface
numa janela desktop Electron, e necessario ter Node.js instalado.

Na raiz do projeto, executar:

```powershell
powershell -ExecutionPolicy Bypass -File .\run-electron-dev.ps1
```

Este script inicia a base de dados e o backend com Docker, instala as
dependencias do frontend e abre a aplicacao desktop.

Depois da primeira execucao, pode ser usado o modo mais rapido:

```powershell
powershell -ExecutionPolicy Bypass -File .\run-electron-dev.ps1 -SkipInstall
```

Para terminar o modo desktop, fechar a aplicacao Electron e executar:

```powershell
docker compose stop backend db
```

## Resolucao de Problemas

### Verificar containers

```powershell
docker compose ps
```

### Consultar logs do backend

```powershell
docker compose logs -f backend
```

### Portas necessarias

As seguintes portas devem estar livres:

```text
8080 - frontend web
3000 - backend
5432 - PostgreSQL
```

Se uma destas portas estiver ocupada, parar o processo/container que a utiliza
e voltar a executar `docker compose up --build`.
