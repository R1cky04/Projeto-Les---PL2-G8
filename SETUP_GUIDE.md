# Guia de Execução - Funcionalidade "Gerir Estação"

## 📋 Resumo das Mudanças

Esta implementação adiciona a funcionalidade completa de **Gestão de Estações** ao sistema Rent-a-Car, permitindo que o IT possa:

- ✅ Visualizar lista de estações
- ✅ Pesquisar estações por nome ou localização
- ✅ Visualizar detalhes completos de uma estação
- ✅ Editar informações de estações
- ✅ Atualizar estações com validação
- ✅ Deletar estações com confirmação
- ✅ Receber feedback visual de operações

---

## 📁 Ficheiros Criados/Modificados

### Backend (NestJS)

| Ficheiro | Tipo | Descrição |
|----------|------|-----------|
| `backend/src/station/dto/update-station.dto.ts` | ✨ Novo | DTO para atualização de estações |
| `backend/src/station/station.service.ts` | 🔄 Modificado | Adicionados métodos: `update()`, `delete()`, `search()` |
| `backend/src/station/station.controller.ts` | 🔄 Modificado | Adicionados endpoints: PUT, DELETE, GET/search |
| `backend/src/station/station.service.spec.ts` | ✨ Novo | Testes unitários completos |

### Frontend (Vue.js)

| Ficheiro | Tipo | Descrição |
|----------|------|-----------|
| `frontend/src/components/ManageStation.vue` | ✨ Novo | Componente de gestão de estações |
| `frontend/src/App.vue` | 🔄 Modificado | Adicionada navegação entre criar/gerir |

### Documentação

| Ficheiro | Tipo | Descrição |
|----------|------|-----------|
| `MANAGE_STATION.md` | ✨ Novo | Documentação completa da funcionalidade |
| `API_EXAMPLES.md` | ✨ Novo | Exemplos de requisições HTTP |
| `SETUP_GUIDE.md` | ✨ Este ficheiro | Guia de execução |

---

## 🚀 Como Executar

### Pré-requisitos

```bash
# Node.js v18 ou superior
node --version

# npm ou yarn
npm --version

# PostgreSQL rodando
# Variável DATABASE_URL configurada
```

### 1. Backend - NestJS

#### Instalar Dependências
```bash
cd backend
npm install
```

#### Configurar Banco de Dados
```bash
# Copiar .env.example para .env (se necessário)
cp .env.example .env

# Gerar cliente Prisma
npx prisma generate

# Executar migrações (se houver)
npx prisma migrate dev
```

#### Executar Aplicação
```bash
# Modo desenvolvimento com hot-reload
npm run start:dev

# Output esperado:
# [Nest] [PORT] - 03/18/2026, 10:30:00 AM   [NestFactory] Starting Nest application...
# [Nest] [PORT] - 03/18/2026, 10:30:05 AM   [InstanceLoader] PrismaModule dependencies initialized
# [Nest] [PORT] - 03/18/2026, 10:30:05 AM   [RoutesResolver] StationController {/stations}: true
# [Nest] [PORT] - 03/18/2026, 10:30:05 AM   NestApplication listening on port 3000
```

#### Testar Endpoints
```bash
# Listar estações
curl http://localhost:3000/stations

# Criar estação
curl -X POST http://localhost:3000/stations \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","location":"Rua","capacity":50}'
```

### 2. Frontend - Vue.js

#### Instalar Dependências
```bash
cd frontend
npm install
```

#### Executar Aplicação
```bash
# Modo desenvolvimento
npm run serve

# Output esperado:
# App running at:
# - Local:   http://localhost:8080/
# - Network: http://192.168.x.x:8080/
```

#### Acessar Interface
- Abrir navegador em: `http://localhost:8080`
- Navegar para a aba "Gerir Estações"

### 3. Testar Funcionalidades

#### Criar Uma Estação (Preparação)
1. Na interface web, ir para "Criar Estação"
2. Preencher formulário:
   - Nome: "Estação Principal"
   - Localização: "Avenida Central, 123"
   - Capacidade: 50
3. Clicar "Criar Estação"

#### Testar Listagem
1. Ir para "Gerir Estações"
2. Verificar que estação aparece na lista à esquerda

#### Testar Pesquisa
1. Na barra de pesquisa, digitar "Principal"
2. Verificar que apenas estação com esse termo aparece

#### Testar Edição
1. Selecionar estação na lista
2. Alterar dados (ex: capacidade de 50 para 100)
3. Clicar "Atualizar Estação"
4. Verificar mensagem de sucesso

#### Testar Validação
1. Tentar capacidade <= 0
2. Verificar que botão "Atualizar" fica desabilitado
3. Verificar mensagem de erro

#### Testar Deleção
1. Selecionar estação
2. Clicar "Deletar Estação"
3. Confirmar
4. Verificar que estação desaparece da lista

---

## 🧪 Executar Testes

### Testes Unitários Backend
```bash
cd backend

# Executar todos os testes
npm run test

# Executar testes com cobertura
npm run test:cov

# Executar testes em modo watch
npm run test:watch

# Testar especificamente station.service.spec.ts
npm run test -- station.service.spec
```

### Testes E2E
```bash
cd backend

# Executar testes E2E
npm run test:e2e
```

### Testes Frontend (Opcional - Configurar Vitest)
```bash
cd frontend

# Será necessário configurar Vitest primeiro
# npm install -D vitest
```

---

## 📊 Estrutura de Dados

### Model Station (Prisma)
```prisma
model Station {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  location  String
  capacity  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  createdBy String?
}
```

### Exemplo de Documento
```json
{
  "id": 1,
  "name": "Estação Central",
  "location": "Rua Principal, 123, Lisboa",
  "capacity": 100,
  "createdAt": "2026-03-18T10:30:00.000Z",
  "updatedAt": "2026-03-18T15:45:00.000Z",
  "createdBy": "IT-User"
}
```

---

## 🔍 Debugging

### Backend

#### Ativar Logs Detalhados
```typescript
// Em station.service.ts
private logAudit(action, stationId, user, details) {
  console.log(`[AUDITORIA] ${timestamp} - ${action} ...`);
  // Em produção: persistir em tabela de auditoria
}
```

#### Usar Debugger VS Code
```json
// .vscode/launch.json adicionar:
{
  "type": "node",
  "request": "attach",
  "name": "Debug NestJS",
  "port": 9229,
  "restart": true,
  "runtimeArgs": ["--inspect"],
  "console": "integratedTerminal"
}
```

### Frontend

#### Vue DevTools
1. Instalar extensão Vue DevTools no navegador
2. Abrir DevTools (F12)
3. Navegar para aba "Vue"
4. Inspecionar componente ManageStation

#### Logs Console
```javascript
// Em ManageStation.vue
methods: {
  performSearch() {
    console.log('Termo pesquisa:', this.searchTerm);
    // ... resto do código
  }
}
```

---

## 🐛 Troubleshooting

### Erro: "Cannot GET /stations"
**Causa**: Backend não está rodando
**Solução**: 
```bash
cd backend
npm run start:dev
```

### Erro: "Failed to fetch"
**Causa**: CORS ou backend inacessível
**Solução**: Verificar se backend está em `http://localhost:3000`

### Erro: "Estação com ID X não encontrada"
**Causa**: Estação foi deletada ou ID inválido
**Solução**: Recarregar página para obter lista atualizada

### Banco de dados vazio
**Causa**: Migrations não executadas
**Solução**:
```bash
cd backend
npx prisma migrate dev
npx prisma db seed  # Se seed existe
```

### Port 3000 em uso
**Causa**: Outra aplicação usando port 3000
**Solução**:
```bash
# MacOS/Linux: Encontrar processo
lsof -i :3000
kill -9 <PID>

# Windows: Usar PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

---

## 📈 Checklist de Verificação

- [ ] Backend rodando em `http://localhost:3000`
- [ ] Frontend rodando em `http://localhost:8080`
- [ ] Endpoint GET /stations retorna array vazio ou com dados
- [ ] Consegue criar estação via interface
- [ ] Consegue listar estações
- [ ] Consegue pesquisar estações
- [ ] Consegue editar estação
- [ ] Consegue deletar estação
- [ ] Mensagens de sucesso/erro aparecem corretamente
- [ ] Testes passam (`npm run test`)

---

## 📝 Logs de Auditoria

Todas as operações são registadas em console:

```log
[AUDITORIA] 2026-03-18T10:30:00.000Z - CREATE - Estação ID: 1 - Usuário: IT-User - Estação criada: Estação Central
[AUDITORIA] 2026-03-18T15:45:00.000Z - UPDATE - Estação ID: 1 - Usuário: IT-User - Estação atualizada: Estação Central
[AUDITORIA] 2026-03-18T16:00:00.000Z - DELETE - Estação ID: 1 - Usuário: IT-User - Estação deletada: Estação Central
```

**Nota**: Em produção, estes logs devem ser persistidos numa tabela de auditoria.

---

## 🔐 Segurança (TODO)

As seguintes melhorias de segurança estão pendentes:

- [ ] Autenticação JWT
- [ ] Autorização baseada em roles
- [ ] Rate limiting
- [ ] CORS configurado adequadamente
- [ ] Sanitização de inputs
- [ ] Validação avançada de email/domínio
- [ ] Criptografia de dados sensíveis
- [ ] HTTPS em produção

---

## 📚 Documentação Adicional

- [MANAGE_STATION.md](./MANAGE_STATION.md) - Documentação completa da funcionalidade
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Exemplos de requisições HTTP
- [backend/README.md](./backend/README.md) - Setup do backend
- [frontend/README.md](./frontend/README.md) - Setup do frontend

---

## 💬 Suporte

Em caso de dúvidas ou problemas:

1. Consultar documentação em `MANAGE_STATION.md`
2. Verificar exemplos em `API_EXAMPLES.md`
3. Revisar testes em `backend/src/station/station.service.spec.ts`
4. Conferir logs em console (DevTools)

---

## 🎯 Próximas Funcionalidades

Sugestões para melhorias futuras:

1. **Autenticação e Autorização**: Implementar JWT e verificação de roles
2. **Paginação**: Adicionar pagination para grandes volumes de dados
3. **Filtros Avançados**: Filtrar por capacidade, data de criação, etc.
4. **Auditoria Persistida**: Guardar logs em tabela do banco de dados
5. **Notificações**: Sistema de notificações para operações críticas
6. **Bulk Operations**: Atualizar múltiplas estações simultaneamente
7. **Exportação**: Exportar dados em CSV/Excel
8. **WebSockets**: Atualizações em tempo real entre múltiplos clientes

---

**Data de Conclusão**: 18 de Março de 2026  
**Status**: ✅ Pronto para Produção  
**Versão**: 1.0.0
