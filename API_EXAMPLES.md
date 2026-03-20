# Exemplos de Requisições HTTP - API de Estações

Este ficheiro contém exemplos de requisições HTTP para testar a API de gerenciamento de estações.

## URL Base da API

```
http://localhost:3000
```

## 1. Criar Estação

### Request
```http
POST /stations HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Estação Central",
  "location": "Rua Principal, 123, Lisboa",
  "capacity": 50
}
```

### Response (201 Created)
```json
{
  "id": 1,
  "name": "Estação Central",
  "location": "Rua Principal, 123, Lisboa",
  "capacity": 50,
  "createdAt": "2026-03-18T10:30:00.000Z",
  "updatedAt": "2026-03-18T10:30:00.000Z",
  "createdBy": "IT-User"
}
```

### Erros Possíveis

#### 400 Bad Request - Capacidade Negativa
```json
{
  "statusCode": 400,
  "message": "Capacidade deve ser um número positivo.",
  "error": "Bad Request"
}
```

#### 409 Conflict - Nome Duplicado
```json
{
  "statusCode": 409,
  "message": "Já existe uma estação com este nome.",
  "error": "Conflict"
}
```

---

## 2. Listar Todas as Estações

### Request
```http
GET /stations HTTP/1.1
Host: localhost:3000
```

### Response (200 OK)
```json
[
  {
    "id": 1,
    "name": "Estação Central",
    "location": "Rua Principal, 123, Lisboa",
    "capacity": 50,
    "createdAt": "2026-03-18T10:30:00.000Z",
    "updatedAt": "2026-03-18T10:30:00.000Z",
    "createdBy": "IT-User"
  },
  {
    "id": 2,
    "name": "Estação Norte",
    "location": "Avenida do Norte, 456, Porto",
    "capacity": 75,
    "createdAt": "2026-03-18T11:00:00.000Z",
    "updatedAt": "2026-03-18T11:00:00.000Z",
    "createdBy": "IT-User"
  }
]
```

---

## 3. Obter Estação por ID

### Request
```http
GET /stations/1 HTTP/1.1
Host: localhost:3000
```

### Response (200 OK)
```json
{
  "id": 1,
  "name": "Estação Central",
  "location": "Rua Principal, 123, Lisboa",
  "capacity": 50,
  "createdAt": "2026-03-18T10:30:00.000Z",
  "updatedAt": "2026-03-18T10:30:00.000Z",
  "createdBy": "IT-User"
}
```

### Erros Possíveis

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Estação com ID 999 não encontrada.",
  "error": "Not Found"
}
```

---

## 4. Pesquisar Estações

### Request
```http
GET /stations/search/Central HTTP/1.1
Host: localhost:3000
```

### Response (200 OK)
```json
[
  {
    "id": 1,
    "name": "Estação Central",
    "location": "Rua Principal, 123, Lisboa",
    "capacity": 50,
    "createdAt": "2026-03-18T10:30:00.000Z",
    "updatedAt": "2026-03-18T10:30:00.000Z",
    "createdBy": "IT-User"
  }
]
```

### Pesquisa por Localização
```http
GET /stations/search/Lisboa HTTP/1.1
Host: localhost:3000
```

### Resposta (sem correspondências)
```json
[]
```

---

## 5. Atualizar Estação (Parcial)

### Request - Atualizar Apenas Capacidade
```http
PUT /stations/1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "capacity": 100
}
```

### Response (200 OK)
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

### Request - Atualizar Múltiplos Campos
```http
PUT /stations/1 HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Estação Centro Atualizada",
  "location": "Rua Principal, 789, Lisboa",
  "capacity": 120
}
```

### Response (200 OK)
```json
{
  "id": 1,
  "name": "Estação Centro Atualizada",
  "location": "Rua Principal, 789, Lisboa",
  "capacity": 120,
  "createdAt": "2026-03-18T10:30:00.000Z",
  "updatedAt": "2026-03-18T15:50:00.000Z",
  "createdBy": "IT-User"
}
```

### Erros Possíveis

#### 400 Bad Request - Capacidade Inválida
```json
{
  "statusCode": 400,
  "message": "Capacidade deve ser um número positivo.",
  "error": "Bad Request"
}
```

#### 409 Conflict - Nome Duplicado
```json
{
  "statusCode": 409,
  "message": "Já existe uma estação com este nome.",
  "error": "Conflict"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Estação com ID 999 não encontrada.",
  "error": "Not Found"
}
```

---

## 6. Deletar Estação

### Request
```http
DELETE /stations/1 HTTP/1.1
Host: localhost:3000
```

### Response (200 OK)
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

### Erros Possíveis

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Estação com ID 999 não encontrada.",
  "error": "Not Found"
}
```

---

## Usando CURL (Linha de Comando)

### Criar Estação
```bash
curl -X POST http://localhost:3000/stations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Estação Central",
    "location": "Rua Principal, 123",
    "capacity": 50
  }'
```

### Listar Estações
```bash
curl http://localhost:3000/stations
```

### Obter Estação
```bash
curl http://localhost:3000/stations/1
```

### Pesquisar
```bash
curl "http://localhost:3000/stations/search/Central"
```

### Atualizar Estação
```bash
curl -X PUT http://localhost:3000/stations/1 \
  -H "Content-Type: application/json" \
  -d '{
    "capacity": 100
  }'
```

### Deletar Estação
```bash
curl -X DELETE http://localhost:3000/stations/1
```

---

## Usando Postman

### Importar Collection

1. Abrir Postman
2. File → Import
3. Copiar e colar a seguinte collection JSON

```json
{
  "info": {
    "name": "Rent-a-Car Stations API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Station",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"Estação Central\",\n  \"location\": \"Rua Principal, 123\",\n  \"capacity\": 50\n}"
        },
        "url": {
          "raw": "http://localhost:3000/stations",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["stations"]
        }
      }
    },
    {
      "name": "Get All Stations",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/stations",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["stations"]
        }
      }
    },
    {
      "name": "Get Station by ID",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/stations/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["stations", "1"]
        }
      }
    },
    {
      "name": "Search Stations",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3000/stations/search/Central",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["stations", "search", "Central"]
        }
      }
    },
    {
      "name": "Update Station",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"capacity\": 100\n}"
        },
        "url": {
          "raw": "http://localhost:3000/stations/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["stations", "1"]
        }
      }
    },
    {
      "name": "Delete Station",
      "request": {
        "method": "DELETE",
        "url": {
          "raw": "http://localhost:3000/stations/1",
          "protocol": "http",
          "host": ["localhost"],
          "port": "3000",
          "path": ["stations", "1"]
        }
      }
    }
  ]
}
```

---

## Códigos de Status HTTP

| Código | Descrição | Cenário |
|--------|-----------|---------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos (capacidade ≤ 0) |
| 404 | Not Found | Estação não encontrada |
| 409 | Conflict | Nome já existe |
| 500 | Server Error | Erro do servidor |

---

## Validações

### Criar/Atualizar Estação

```javascript
{
  "name": {
    "type": "string",
    "required": true,
    "unique": true,
    "minLength": 1
  },
  "location": {
    "type": "string",
    "required": true,
    "minLength": 1
  },
  "capacity": {
    "type": "number",
    "required": true,
    "minimum": 1
  }
}
```

---

## Notas Importantes

1. **Autenticação**: A integração de autenticação (JWT) está pendente. Por enquanto, a API aceita requisições sem token.

2. **CORS**: Se estiver testando de um domínio diferente, configure CORS no backend.

3. **Debounce**: A pesquisa frontend tem debounce de 300ms para evitar requisições excessivas.

4. **Auditoria**: Todas as operações (CREATE, UPDATE, DELETE) são registadas em log.

5. **Persistência**: Os dados são persistidos em PostgreSQL via Prisma ORM.

---

**Última atualização**: 18 de Março de 2026
