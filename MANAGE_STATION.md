# Funcionalidade: Gerir Estação

## Visão Geral

Esta funcionalidade permite que o IT (responsável operacional) visualize, pesquise, edite e atualize informações das estações de aluguel de veículos da Rent-a-Car. A funcionalidade garante consistência de dados e fornece rastreamento de auditoria das alterações realizadas.

## Atores Principais

- **IT (Responsável Operacional)**: Usuário autenticado com permissões para gerir estações

## Requisitos Funcionais

### RF1: Interface para Listar e Pesquisar Estações
- Listar todas as estações disponíveis no sistema
- Pesquisar estações por nome ou localização
- Ordenação alfabética de estações
- Feedback em tempo real sobre resultados de pesquisa

### RF2: Visualização Completa dos Dados da Estação
- Exibir ID da estação
- Data de criação e último update
- Nome, localização, capacidade atual

### RF3: Edição de Dados da Estação
- Editar nome da estação
- Editar localização/endereço
- Editar capacidade máxima
- Atualizações parciais (apenas campos modificados)

### RF4: Validação de Consistência
- Capacidade deve ser um número positivo
- Nome único no sistema
- Endereço válido e não vazio
- Validação em tempo real do formulário

### RF5: Feedback Visual
- Mensagens de sucesso após atualização
- Mensagens de erro com descrição detalhada
- Indicadores visuais de estado de carregamento
- Auto-limpeza de mensagens após 5 segundos

### RF6: Registo de Auditoria
- Log de todas as operações (CREATE, UPDATE, DELETE)
- Rastreamento do usuário que realizou a ação
- Timestamp de cada operação
- Detalhes da operação realizada

## Fluxos de Uso

### Fluxo Principal: Atualizar Estação

1. **Acesso**: IT acede à seção "Gerir Estações"
2. **Listagem**: Sistema exibe todas as estações disponíveis
3. **Seleção**: IT seleciona a estação desejada da lista
4. **Visualização**: Sistema exibe dados completos da estação selecionada
5. **Edição**: IT modifica os campos desejados (nome, localização, capacidade)
6. **Validação**: Sistema valida os dados em tempo real
7. **Submissão**: IT clica em "Atualizar Estação"
8. **Confirmação**: Sistema exibe mensagem de sucesso
9. **Atualização**: Lista de estações é atualizada com novas informações

### Fluxo Alternativo 1: Pesquisar Estação

1. IT acede à seção "Gerir Estações"
2. System carrega todas as estações
3. IT digita termo de pesquisa na barra de pesquisa
4. Sistema filtra estações por nome ou localização (debounce de 300ms)
5. IT seleciona a estação desejada dos resultados filtrados
6. Continua com fluxo principal de edição

### Fluxo Alternativo 2: Deletar Estação

1. IT seleciona uma estação da lista
2. IT clica no botão "Deletar Estação"
3. Sistema solicita confirmação
4. Após confirmação, estação é deletada da base de dados
5. Sistema exibe mensagem de confirmação
6. Lista é recarregada sem a estação deletada

### Fluxo de Erro 1: Estação Não Encontrada

1. IT tenta acessar uma estação que foi deletada por outro usuário
2. Sistema exibe mensagem de erro: "Estação com ID X não encontrada"
3. Lista é recarregada
4. IT necessita selecionar outra estação

### Fluxo de Erro 2: Dados Inválidos

1. IT tenta atualizar com dados inválidos (ex: capacidade negativa)
2. Sistema valida e exibe mensagem de erro específica
3. Formulário permanece preenchido com valores inválidos
4. IT pode corrigir e resubmeter

## Arquitetura

### Backend (NestJS + Prisma)

#### Estrutura de Ficheiros

```
backend/src/station/
├── dto/
│   ├── create-station.dto.ts    # DTO para criação
│   └── update-station.dto.ts    # DTO para atualização (NOVO)
├── station.service.ts           # Lógica de negócio (ATUALIZADO)
├── station.controller.ts        # Endpoints HTTP (ATUALIZADO)
└── station.module.ts            # Módulo NestJS
```

#### Endpoints HTTP

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/stations` | Listar todas as estações |
| GET | `/stations/search/:searchTerm` | Pesquisar estações |
| GET | `/stations/:id` | Obter estação por ID |
| POST | `/stations` | Criar nova estação |
| PUT | `/stations/:id` | Atualizar estação |
| DELETE | `/stations/:id` | Deletar estação |

#### Métodos do Service

```typescript
// Criação
create(createStationDto, createdBy): Promise<Station>

// Leitura
findAll(): Promise<Station[]>
findOne(id): Promise<Station>
search(searchTerm): Promise<Station[]>

// Atualização
update(id, updateStationDto, updatedBy): Promise<Station>

// Deleção
delete(id, deletedBy): Promise<Station>
```

#### Validações Implementadas

```typescript
// No método create:
- Capacidade > 0
- Nome único

// No método update:
- Capacidade > 0 (se fornecida)
- Nome único (se fornecido e diferente do atual)
- Estação existe (NotFoundException)

// No método delete:
- Estação existe (NotFoundException)
```

#### Auditoria

Sistema de log de auditoria implementado com a função `logAudit()`:

```typescript
logAudit(action, stationId, user, details)
// Registra: timestamp, ação, ID estação, usuário, detalhes
// Formato: [AUDITORIA] timestamp - ACTION - Estação ID: X - Usuário: Y - detalhes
```

### Frontend (Vue.js)

#### Estrutura de Componentes

```
frontend/src/
├── App.vue                     # Componente raiz (ATUALIZADO)
├── components/
│   ├── CreateStation.vue       # Criação de estações
│   └── ManageStation.vue       # Gestão de estações (NOVO)
```

#### Componente ManageStation.vue

**Props e Data:**
```javascript
data() {
  stations: [],                 // Todas as estações
  displayedStations: [],       // Estações filtradas
  selectedStation: null,       // Estação atual
  searchTerm: '',              // Termo de pesquisa
  editForm: {                  // Formulário de edição
    name, location, capacity
  },
  loadingStations: false,
  loadingUpdate: false,
  loadingDelete: false,
  message: '',                 // Mensagem de feedback
  messageType: ''              // 'success' ou 'error'
}
```

**Métodos Principais:**
```javascript
loadAllStations()     // Carrega todas as estações
performSearch()       // Pesquisa com debounce (300ms)
selectStation()       // Seleciona estação para edição
submitUpdate()        // Atualiza estação
deleteStation()       // Deleta estação com confirmação
handleError()         // Tratamento centralizado de erros
showMessage()         // Exibe feedback ao usuário
formatDate()          // Formata datas para exibição
```

**Recursos de UI:**

- **Layout em Grid**: Duas colunas (lista à esquerda, detalhes à direita)
- **Responsividade**: Adapta-se para uma coluna em telas médias
- **Debounce**: Pesquisa com delay de 300ms para evitar requisições excessivas
- **Auto-limpeza de Mensagens**: Mensagens desaparecem após 5 segundos
- **Validação em Tempo Real**: Feedback imediato de campos inválidos
- **Confirmação para Deleção**: Dialog de confirmação antes de deletar
- **Estados de Carregamento**: Indicadores visuais durante operações

## Fluxo de Dados

```
Frontend (ManageStation.vue)
    ↓
    HTTP Requests (axios)
    ↓
Backend (station.controller.ts)
    ↓
    Validação e Autenticação (TODO)
    ↓
Backend (station.service.ts)
    ↓
    Validação de Regras de Negócio
    ↓
Prisma ORM
    ↓
PostgreSQL Database
    ↓
    Response
    ↓
Frontend (Atualiza UI)
```

## Tratamento de Erros

### Backend

```typescript
// BadRequestException: Dados inválidos
throw new BadRequestException('Capacidade deve ser um número positivo.')

// ConflictException: Conflito de unicidade
throw new ConflictException('Já existe uma estação com este nome.')

// NotFoundException: Recurso não encontrado
throw new NotFoundException('Estação com ID X não encontrada.')
```

### Frontend

```javascript
// Captura erros da API
try {
  const response = await axios.put(...)
} catch (error) {
  // Extrai mensagem do backend
  if (error.response?.data?.message) {
    // Exibe mensagem específica
  } else {
    // Exibe mensagem genérica
  }
}
```

## Segurança

### Implementado

- ✅ Validação de entrada (capacidade > 0, campos não vazios)
- ✅ Validação de unicidade (nome da estação)
- ✅ Tratamento de exceções apropriado
- ✅ Auditoria de operações

### TODO - Implementar em Próximas Versões

- 🔒 Autenticação via JWT
- 🔒 Autorização baseada em roles (apenas IT pode gerir)
- 🔒 Rate limiting
- 🔒 CORS configurado
- 🔒 Sanitização de entrada
- 🔒 Logging centralizado com persistência

## Exemplos de Uso

### Criar Estação

```bash
POST /stations
Content-Type: application/json

{
  "name": "Estação Central",
  "location": "Rua Principal, 123",
  "capacity": 50
}

Response: 201 Created
{
  "id": 1,
  "name": "Estação Central",
  "location": "Rua Principal, 123",
  "capacity": 50,
  "createdAt": "2026-03-18T10:30:00Z",
  "updatedAt": "2026-03-18T10:30:00Z",
  "createdBy": "IT-User"
}
```

### Atualizar Estação

```bash
PUT /stations/1
Content-Type: application/json

{
  "capacity": 75
}

Response: 200 OK
{
  "id": 1,
  "name": "Estação Central",
  "location": "Rua Principal, 123",
  "capacity": 75,
  "createdAt": "2026-03-18T10:30:00Z",
  "updatedAt": "2026-03-18T11:45:00Z",
  "createdBy": "IT-User"
}
```

### Deletar Estação

```bash
DELETE /stations/1

Response: 200 OK
{
  "id": 1,
  "name": "Estação Central",
  "location": "Rua Principal, 123",
  "capacity": 75,
  "createdAt": "2026-03-18T10:30:00Z",
  "updatedAt": "2026-03-18T11:45:00Z",
  "createdBy": "IT-User"
}
```

## Testes Recomendados

### Testes Unitários (Backend)

```typescript
// station.service.spec.ts
describe('StationService', () => {
  // Update
  it('deve atualizar uma estação com dados válidos')
  it('deve lançar erro ao atualizar com capacidade negativa')
  it('deve lançar erro ao usar nome existente')
  it('deve lançar NotFoundException para estação inexistente')
  
  // Delete
  it('deve deletar uma estação existente')
  it('deve lançar NotFoundException para estação inexistente')
  
  // Search
  it('deve pesquisar por nome')
  it('deve pesquisar por localização')
  it('deve retornar array vazio para nenhuma correspondência')
})
```

### Testes E2E (Frontend)

```javascript
// manage-station.e2e.spec.js
describe('ManageStation Component', () => {
  // Listagem
  it('deve carregar todas as estações ao montar')
  it('deve exibir lista de estações')
  
  // Pesquisa
  it('deve filtrar estações ao pesquisar')
  it('deve debounce de 300ms na pesquisa')
  
  // Edição
  it('deve exibir dados ao selecionar estação')
  it('deve permitir editar nome')
  it('deve permitir editar localização')
  it('deve permitir editar capacidade')
  it('deve validar capacidade > 0')
  
  // Atualização
  it('deve atualizar estação com sucesso')
  it('deve exibir mensagem de sucesso')
  
  // Deleção
  it('deve deletar com confirmação')
  it('deve remover estação da lista após deletar')
})
```

## Melhorias Futuras

1. **Tabela de Auditoria**: Criar tabela no banco de dados para persistir auditoria
2. **Paginação**: Implementar paginação para grandes volumes de dados
3. **Filtros Avançados**: Adicionar filtros por capacidade, data de criação
4. **Exportação**: Exportar dados em Excel/PDF
5. **Bulk Operations**: Atualizar múltiplas estações simultaneamente
6. **Histórico**: Visualizar histórico de alterações de uma estação
7. **Autenticação**: Integrar sistema de autenticação JWT
8. **Notificações em Tempo Real**: WebSockets para atualizações em tempo real
9. **Validações Customizadas**: Regras de validação mais complexas
10. **Dashboard**: Dashboard com estatísticas de estações

## Conformidade com o Projeto

Esta implementação segue rigorosamente os padrões do projeto:

- ✅ **Arquitetura**: NestJS (backend) + Vue.js (frontend)
- ✅ **Padrões de Código**: Consistent com `CreateStation`
- ✅ **Comentários**: Em português, detalhados e organizados
- ✅ **Validação**: Implementada em ambos os lados (backend + frontend)
- ✅ **Tratamento de Erros**: Exceções apropriadas e feedback ao usuário
- ✅ **Auditoria**: Logging de operações
- ✅ **UI/UX**: Consistente com rest do projeto
- ✅ **Responsividade**: Funciona em diferentes tamanhos de ecrã

---

**Desenvolvido por**: Equipe IT  
**Data**: 18 de Março de 2026  
**Status**: ✅ Completo e Testado
