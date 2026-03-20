# 📐 Arquitetura Visual - Funcionalidade "Gerir Estação"

## Diagrama de Fluxo - Atualizar Estação

```
┌─────────────────────────────────────────────────────────────────┐
│                      ATOR PRINCIPAL: IT                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Acessa "Gerir        │
                    │  Estação" na App      │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Página carrega com   │
                    │  lista de estações    │
                    │  (GET /stations)      │
                    └───────────┬───────────┘
                                │
                                ▼
                   ┌────────────────────────────┐
                   │ Seleciona estação desejada │
                   └────────────┬───────────────┘
                                │
                                ▼
                   ┌────────────────────────────┐
                   │ Visualiza dados atuais     │
                   │ (ID, nome, localização,    │
                   │  capacidade, datas)        │
                   └────────────┬───────────────┘
                                │
                                ▼
                   ┌────────────────────────────┐
                   │ Modifica campos desejados  │
                   │ (nome, localização,        │
                   │  capacidade)               │
                   └────────────┬───────────────┘
                                │
                                ▼
                   ┌────────────────────────────┐
         ┌─────────│  Valida formulário (FE)    │──────────┐
         │         │  - campos não vazios       │          │
         │         │  - capacidade > 0          │          │
         │         └──────────┬─────────────────┘          │
         │                    │                            │
         │          ┌─────────┴──────────┐                │
         │          │                    │                │
         │   ✅ Válido         ❌ Inválido              │
         │          │                    │                │
         │          ▼                    ▼                │
         │    [ATIVAR BOTÃO]   [DESATIVAR BOTÃO]         │
         │          │         [EXIBIR ERRO]               │
         │          │                    │                │
         └──────────┼────────────────────┴────────────────┘
                    │
                    ▼
         ┌──────────────────────────────┐
         │ Clica "Atualizar Estação"    │
         └──────────┬───────────────────┘
                    │
                    ▼
         ┌──────────────────────────────┐
         │ Backend valida dados (BE)    │
         │ - Capacidade > 0             │
         │ - Nome único                 │
         │ - Estação existe             │
         └────┬──────────────────────┬──┘
              │                      │
       ✅ OK  │            ❌ ERRO  │
              │                      │
              ▼                      ▼
    ┌──────────────────┐   ┌──────────────────┐
    │ Atualiza BD      │   │ Retorna erro     │
    │ (PUT /stations)  │   │ (400/404/409)    │
    │                  │   │                  │
    │ [AUDITORIA]      │   └────────┬─────────┘
    └────────┬─────────┘            │
             │                      │
             ▼                      ▼
    ┌──────────────────────────────────────┐
    │  Exibe mensagem de resultado        │
    │  ✓ Sucesso ou ✗ Erro               │
    │  (auto-limpa após 5 segundos)       │
    └────────┬─────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────┐
    │  Atualiza lista na interface         │
    │  Recarrega dados da estação          │
    └──────────────────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────────┐
    │        FIM DO FLUXO ✅              │
    │   Dados consistentes e atualizados  │
    └──────────────────────────────────────┘
```

---

## Diagrama de Arquitetura - Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                           FRONTEND                              │
│                       (Vue.js - Port 8080)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                    App.vue                              │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │         Navigation Bar (Sticky)                  │  │  │
│  │  │  [Criar Estação] [Gerir Estações]              │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  │                                                         │  │
│  │  ┌────────────────────────────────────────────────┐   │  │
│  │  │   Componente Ativo (Create ou Manage)         │   │  │
│  │  └────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                           │                                    │
│       ┌───────────────────┴───────────────────┐              │
│       │                                       │              │
│       ▼                                       ▼              │
│  ┌──────────────────┐               ┌──────────────────┐   │
│  │ CreateStation.vue│               │ManageStation.vue │   │
│  ├──────────────────┤               ├──────────────────┤   │
│  │ • Form input     │               │ • Search bar     │   │
│  │ • Validation     │               │ • Station list   │   │
│  │ • Submit create  │               │ • Station details│   │
│  │ • Feedback msg   │               │ • Edit form      │   │
│  └──────┬───────────┘               │ • Validation     │   │
│         │                           │ • Submit/delete  │   │
│         └──────────────┬────────────┤ • Feedback msg   │   │
│                        │            └──────┬───────────┘   │
│                        │                   │               │
│                        ▼                   ▼               │
│                ┌─────────────────────────────┐             │
│                │      axios (HTTP)           │             │
│                │  • JSON serialization       │             │
│                │  • Error handling           │             │
│                │  • Request/Response mgmt    │             │
│                └──────┬──────────────────────┘             │
│                       │                                   │
└───────────────────────┼───────────────────────────────────┘
                        │
        ================│================
        │
┌───────▼───────────────────────────────────────────────────────┐
│                           BACKEND                             │
│                    (NestJS - Port 3000)                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         HTTP Middleware & Pipes                      │   │
│  │  • Body parser • Validation • Error handling        │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                            │
│                 ▼                                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          StationController                           │   │
│  │  @Controller('stations')                             │   │
│  │  ├─ @Post() → create()                              │   │
│  │  ├─ @Get() → findAll()                              │   │
│  │  ├─ @Get(':id') → findOne()                         │   │
│  │  ├─ @Get('search/:term') → search()                 │   │
│  │  ├─ @Put(':id') → update()    ✨ NEW               │   │
│  │  └─ @Delete(':id') → delete() ✨ NEW               │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                            │
│                 ▼                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           StationService                              │ │
│  │  @Injectable()                                        │ │
│  │  ├─ create() - Validate & create station             │ │
│  │  ├─ update() - Validate & update station  ✨ NEW   │ │
│  │  ├─ delete() - Delete station with audit ✨ NEW   │ │
│  │  ├─ findAll() - Get all ordered by name             │ │
│  │  ├─ findOne() - Get by ID with validation           │ │
│  │  ├─ search() - Search by name/location  ✨ NEW   │ │
│  │  └─ logAudit() - Log all operations                │ │
│  └──────────────┬───────────────────────────────────────┘ │
│                 │                                          │
│        ┌────────┴────────┬────────────┬──────────┐        │
│        │                 │            │          │        │
│        ▼                 ▼            ▼          ▼        │
│  ┌──────────┐   ┌───────────┐  ┌──────────┐  ┌──────┐   │
│  │  DTOs    │   │ Prisma    │  │ Logger   │  │Guards│   │
│  │          │   │ Service   │  │          │  │(TODO)│   │
│  │•Create   │   │           │  │Console   │  │      │   │
│  │•Update   │   │Executes   │  │Log       │  │      │   │
│  │  DTO ✨  │   │Database   │  │Auditoria │  │      │   │
│  └──────────┘   │Queries    │  └──────────┘  └──────┘   │
│                 │via ORM    │                           │
│                 └─────┬─────┘                           │
│                       │                                 │
└───────────────────────┼─────────────────────────────────┘
                        │
        ════════════════╬════════════════
                        │
        ┌───────────────▼─────────────────┐
        │     PostgreSQL Database         │
        │  (Port 5432 / Docker)           │
        ├─────────────────────────────────┤
        │  Table: Station                 │
        │  • id (PK)                      │
        │  • name (UNIQUE)                │
        │  • location                     │
        │  • capacity                     │
        │  • createdAt                    │
        │  • updatedAt                    │
        │  • createdBy (FK)               │
        └─────────────────────────────────┘
```

---

## Diagrama de Estados - UI

```
                    ┌─────────────────┐
                    │  [ Inicializado] │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Carregando Lista│
                    │  loading: true  │
                    └────────┬─────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
        ❌ Erro     │      ✅ OK       │    ✅ OK
           │        │      │          │       │
           ▼        │      ▼          │       ▼
    ┌──────────┐   │  ┌──────────┐   │  ┌──────────┐
    │ Exibir   │   │  │ Listar   │   │  │ Sem      │
    │ Erro     │   │  │ Estações │   │  │ Estações │
    │ Msg      │   │  └─────┬────┘   │  └──────────┘
    └──────────┘   │        │        │
                   │        │        │
                   └────────┼────────┘
                            │
                    ┌───────▼────────┐
                    │ Aguardando     │
                    │ Seleção        │
                    └───────┬────────┘
                            │
         ┌──────────────────┤
         │ Usuário seleciona │
         │ estação
         │
         ▼
    ┌──────────────┐
    │ Selecionada  │  Exibe dados
    │ &            │  Ativa formulário
    │ Carregando   │  de edição
    │ Detalhes     │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │ Pronto para  │
    │ Edição       │
    └──────┬───────┘
           │
    ┌──────┴──────┐
    │             │
    │ Usuário edita
    │
    ▼                      ▼
┌──────────┐      ┌──────────────────┐
│ Pesquisa │      │ Modifica Campos  │
│          │      │ • Nome           │
│ Debounce │      │ • Localização    │
│ 300ms    │      │ • Capacidade     │
│          │      │                  │
│ Real-time│      │ Valida em tempo  │
│ Filter   │      │ real             │
└─────┬────┘      └────────┬─────────┘
      │                    │
      └────────┬───────────┘
               │
               ▼
    ┌──────────────────┐
    │ Formulário       │
    │ Validado         │
    │                  │
    │ Botão Ativo      │
    │ [Atualizar]      │
    └────────┬─────────┘
             │
         Clique
             │
             ▼
    ┌──────────────────┐
    │ Submeter Update  │
    │ (PUT /stations)  │
    │ Loading: true    │
    └────────┬─────────┘
             │
        ┌────┴─────┐
        │           │
  ❌ Erro    ✅ OK
      │         │
      ▼         ▼
┌──────────┐ ┌──────────────┐
│ Exibir   │ │ Atualizar    │
│ Mensagem │ │ Lista/Dados  │
│ de Erro  │ │              │
└──────────┘ │ Exibir Msg   │
             │ de Sucesso   │
             │              │
             │ Auto-limpa   │
             │ msg (5s)     │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │ De Volta ao  │
             │ Estado de    │
             │ Espera       │
             └──────────────┘
```

---

## Diagrama de Fluxo de Dados - Request/Response

```
┌─────────────────────────────────────────────────────────────┐
│                  UPDATE ESTAÇÃO FLOW                        │
└─────────────────────────────────────────────────────────────┘

Frontend (ManageStation.vue)
    │
    │  submitUpdate()
    │  ├─ isFormValid ✓
    │  ├─ loadingUpdate = true
    │  └─ axios.put('/stations/:id', updateData)
    │
    ▼
┌──────────────────────────────────────────┐
│      HTTP PUT Request                    │
├──────────────────────────────────────────┤
│  URL:    http://localhost:3000/stations/1│
│  Method: PUT                             │
│  Body: {                                 │
│    "name": "Novo Nome",                  │
│    "location": "Nova Loc",               │
│    "capacity": 100                       │
│  }                                       │
└──────────────────┬───────────────────────┘
                   │
                   ▼
            Backend (NestJS)
         StationController
         ├─ @Put(':id')
         │
         ▼
         Params validation (ParseIntPipe)
         ├─ id = 1 ✓
         │
         ▼
         Body validation (DTO)
         ├─ UpdateStationDto ✓
         │
         ▼
         Call service.update(id, dto, user)
         │
         ▼
      StationService.update()
      ├─ Check station exists
      │  ├─ findUnique({ id: 1 })
      │  └─ NotFoundException if not found
      │
      ├─ Validate capacity > 0
      │  └─ BadRequestException if invalid
      │
      ├─ Check name uniqueness (if provided)
      │  ├─ findUnique({ name })
      │  └─ ConflictException if duplicate
      │
      ├─ Prepare update data
      │  └─ Only include provided fields
      │
      ├─ Execute update
      │  └─ prisma.station.update()
      │
      ├─ Log audit
      │  └─ [AUDITORIA] UPDATE - Station ID: 1 - User: IT-User
      │
      └─ Return updated station
         │
         ▼
┌───────────────────────────────────────┐
│    HTTP 200 OK Response               │
├───────────────────────────────────────┤
│  {                                    │
│    "id": 1,                           │
│    "name": "Novo Nome",               │
│    "location": "Nova Loc",            │
│    "capacity": 100,                   │
│    "createdAt": "2026-03-18T...",     │
│    "updatedAt": "2026-03-18T...",     │
│    "createdBy": "IT-User"             │
│  }                                    │
└────────────────┬──────────────────────┘
                 │
                 ▼
         Frontend receives response
         ├─ catch error: handleError()
         └─ success:
             ├─ Update selectedStation
             ├─ Update stations array
             ├─ Update displayedStations
             ├─ showMessage('Sucesso', 'success')
             └─ loadingUpdate = false
            │
             ▼
         UI Update
         ├─ Re-render selected station details
         ├─ Re-render list item
         ├─ Display success message
         └─ Auto-cleanup message (5s)
            │
             ▼
         ✓ Estado Consistente
```

---

## Diagrama de Requisições HTTP

```
┌─────────────────────────────────────────────────┐
│         ESTAÇÕES API - Endpoints HTTP           │
└─────────────────────────────────────────────────┘

GET /stations
├─ Descrição: Obter todas as estações
├─ Autenticação: TODO: Bearer token
├─ Response: 200 OK
│  └─ Body: Station[]
└─ Uso: Listar estações

GET /stations/:id
├─ Descrição: Obter estação por ID
├─ Parâmetro: id (number)
├─ Response: 200 OK
│  └─ Body: Station
├─ Error: 404 Not Found
└─ Uso: Detalhes de estação

GET /stations/search/:searchTerm
├─ Descrição: Pesquisar estações
├─ Parâmetro: searchTerm (string)
├─ Response: 200 OK
│  └─ Body: Station[]
└─ Uso: Filtro por nome/localização

POST /stations
├─ Descrição: Criar nova estação ✏️ EXISTENTE
├─ Body: CreateStationDto
│  ├─ name (string, unique)
│  ├─ location (string)
│  └─ capacity (number > 0)
├─ Response: 201 Created
│  └─ Body: Station
├─ Error: 400 Bad Request
│        409 Conflict
└─ Uso: Criar estação

PUT /stations/:id
├─ Descrição: Atualizar estação  ✨ NOVO
├─ Parâmetro: id (number)
├─ Body: UpdateStationDto (tudo optional)
│  ├─ name? (string, unique)
│  ├─ location? (string)
│  └─ capacity? (number > 0)
├─ Response: 200 OK
│  └─ Body: Station (atualizada)
├─ Error: 400 Bad Request
│        404 Not Found
│        409 Conflict
└─ Uso: Atualizar estação

DELETE /stations/:id
├─ Descrição: Deletar estação     ✨ NOVO
├─ Parâmetro: id (number)
├─ Response: 200 OK
│  └─ Body: Station (deletada)
├─ Error: 404 Not Found
└─ Uso: Remover estação
```

---

## Diagrama de Validação

```
                    ┌──────────────────┐
                    │  Input Data      │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Frontend (Vue)  │
                    │  Validação Real  │
                    │  Time            │
                    ├──────────────────┤
                    │ • Campos vazios? │
                    │ • Capacidade>0?  │
                    │ • Formato?       │
                    │                  │
                    └────────┬─────────┘
                             │
                    ┌────────▼────────┐
                    │  Botão Status   │
                    ├─────────────────┤
                    │ Válido: Ativo   │
                    │ Inválido:       │
                    │ Desabilitado    │
                    │ + Msg Erro      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Submit Request │
                    └────────┬────────┘
                             │
                    ┌────────▼──────────────┐
                    │  Backend (NestJS)    │
                    │ Validação Crítica    │
                    ├───────────────────────┤
                    │ • capacity > 0?       │
                    │ • name unique?        │
                    │ • station exists?     │
                    │ • campos valid?       │
                    └────────┬──────────────┘
                             │
                    ┌────────┴──────────┐
                    │                   │
              ✓ Válido         ✗ Inválido
                │                   │
                ▼                   ▼
          ┌──────────┐     ┌──────────────┐
          │ Executa  │     │ Retorna Erro │
          │ Update   │     │ 400/404/409  │
          │ BD       │     │              │
          └────┬─────┘     │ Msg Específ. │
               │           └──────┬───────┘
               ├───────────────────┤
               │                   │
               ▼                   ▼
        ┌────────────┐     ┌──────────────┐
        │ Retorna    │     │ Frontend     │
        │ Success    │     │ exibe erro   │
        │ Response   │     │ específico   │
        └────┬───────┘     └──────────────┘
             │
             ▼
    ┌─────────────────┐
    │ Frontend        │
    │ Atualiza UI     │
    └─────────────────┘
```

---

**Documentação Visual Completa**  
**Data**: 18/03/2026  
**Versão**: 1.0.0
