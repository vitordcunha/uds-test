# ✅ Checklist Backend - Desafio Full-Stack Kanban

## 📋 Requisitos Funcionais

### Boards (Quadros)

- [x] **GET /api/boards** - Listar todos os boards
- [x] **GET /api/boards/:id** - Obter board por ID (com colunas e cards)
- [x] **POST /api/boards** - Criar novo board
- [x] Validação de nome do board (obrigatório, máximo 255 caracteres)

### Columns (Colunas)

- [x] **POST /api/boards/:boardId/columns** - Criar nova coluna em um board
- [x] Validação de nome da coluna (obrigatório, máximo 255 caracteres)
- [x] Suporte a ordem (order) nas colunas

### Cards (Cartões)

- [x] **POST /api/columns/:columnId/cards** - Criar novo card em uma coluna
- [x] **PUT /api/cards/:id** - Atualizar card (título e descrição)
- [x] **DELETE /api/cards/:id** - Deletar card
- [x] **PATCH /api/cards/:id/move** - Mover card entre colunas
- [x] Validação de título do card (obrigatório, máximo 255 caracteres)
- [x] Descrição opcional

### Regra de Negócio Crítica ⚠️

- [x] **Card só pode ser movido entre colunas do mesmo board**
  - [x] Implementada na entidade Card (`moveToColumn`)
  - [x] Validada no use case `MoveCardBetweenColumns`
  - [x] Testada unitariamente

---

## 🏗️ Arquitetura

### Clean Architecture

- [x] **Domain Layer** (Entidades e Value Objects)

  - [x] Entidade `Board`
  - [x] Entidade `Column`
  - [x] Entidade `Card`
  - [x] Value Object `BoardName`
  - [x] Value Object `ColumnName`
  - [x] Value Object `CardTitle`
  - [x] Exceções de domínio (`DomainException`)

- [x] **Application Layer** (Use Cases)

  - [x] `CreateBoard`
  - [x] `GetAllBoards`
  - [x] `GetBoardById`
  - [x] `CreateColumn`
  - [x] `CreateCard`
  - [x] `UpdateCard`
  - [x] `DeleteCard`
  - [x] `MoveCardBetweenColumns`

- [x] **Infrastructure Layer** (Repositórios e Banco de Dados)

  - [x] `BoardRepository` (implementação com Drizzle)
  - [x] `ColumnRepository` (implementação com Drizzle)
  - [x] `CardRepository` (implementação com Drizzle)
  - [x] Schema do banco de dados (Drizzle)
  - [x] Migrations configuradas

- [x] **Presentation Layer** (Controllers e Rotas)
  - [x] `BoardController`
  - [x] `ColumnController`
  - [x] `CardController`
  - [x] Rotas configuradas com validação
  - [x] Middleware de tratamento de erros
  - [x] Middleware de logging de requisições

---

## 🧪 Testes

### Testes Unitários

- [x] Testes de entidades de domínio

  - [x] `Board.test.ts` - Criação e validações
  - [x] `Column.test.ts` - Criação e validações
  - [x] `Card.test.ts` - Criação, validações e regra de movimento

- [x] Testes de use cases
  - [x] `CreateBoard.test.ts`
  - [x] `GetAllBoards.test.ts`
  - [x] `GetBoardById.test.ts`
  - [x] `CreateColumn.test.ts`
  - [x] `CreateCard.test.ts`
  - [x] `UpdateCard.test.ts` ✅ (todos os métodos nos mocks)
  - [x] `DeleteCard.test.ts` ✅ (todos os métodos nos mocks)
  - [x] `MoveCardBetweenColumns.test.ts` ✅ (todos os métodos nos mocks)

### Testes de Integração

- [x] Setup de banco de dados de teste
  - [x] Arquivo `tests/integration/setup.ts` criado
  - [x] Helpers de banco de dados configurados (reutilizados de E2E)
  - [x] Configuração Jest específica (`jest.config.integration.js`)
  - [x] Teste de validação do setup passando (3 testes)
- [x] Testes de repositórios com banco de dados real
  - [x] BoardRepository.integration.test.ts (11 testes passando)
    - [x] findAll() - Retorna todos os boards
    - [x] findAll() - Retorna array vazio quando não há boards
    - [x] findById() - Retorna board quando existe
    - [x] findById() - Retorna null quando não existe
    - [x] findByColumnId() - Retorna board quando coluna existe
    - [x] findByColumnId() - Retorna null quando coluna não existe
    - [x] findByColumnId() - Retorna board com todas as colunas
    - [x] create() - Cria board com sucesso
    - [x] create() - Board criado tem ID gerado
    - [x] create() - Board é persistido no banco
    - [x] create() - Múltiplos boards têm IDs diferentes
  - [x] ColumnRepository.integration.test.ts (14 testes passando)
    - [x] findById() - Retorna coluna quando existe
    - [x] findById() - Retorna null quando não existe
    - [x] findById() - Retorna coluna com order quando definido
    - [x] findByBoardId() - Retorna colunas de um board
    - [x] findByBoardId() - Retorna array vazio quando board não tem colunas
    - [x] findByBoardId() - Retorna array vazio quando board não existe
    - [x] findByBoardId() - Retorna colunas ordenadas por order
    - [x] findByBoardId() - Retorna colunas com order padrão (0)
    - [x] create() - Cria coluna com sucesso
    - [x] create() - Coluna criada tem ID gerado
    - [x] create() - Coluna criada com order quando fornecido
    - [x] create() - Coluna é persistida no banco
    - [x] create() - Múltiplas colunas têm IDs diferentes
    - [x] create() - Coluna criada com order padrão (0) quando não fornecido
  - [x] CardRepository.integration.test.ts (20 testes passando)
    - [x] findById() - Retorna card quando existe
    - [x] findById() - Retorna null quando não existe
    - [x] findById() - Retorna card com descrição quando definida
    - [x] findByColumnId() - Retorna cards de uma coluna
    - [x] findByColumnId() - Retorna array vazio quando coluna não tem cards
    - [x] findByColumnId() - Retorna array vazio quando coluna não existe
    - [x] create() - Cria card com sucesso
    - [x] create() - Card criado tem ID gerado
    - [x] create() - Card criado com descrição quando fornecida
    - [x] create() - Card é persistido no banco
    - [x] create() - Múltiplos cards têm IDs diferentes
    - [x] update() - Atualiza título do card
    - [x] update() - Atualiza descrição do card
    - [x] update() - Atualiza columnId do card
    - [x] update() - Atualiza ambos título e descrição
    - [x] update() - Lança erro quando card não tem ID
    - [x] update() - Lança erro quando card não existe no banco
    - [x] delete() - Deleta card com sucesso
    - [x] delete() - Não lança erro ao deletar card inexistente
    - [x] delete() - Remove card dos resultados de findByColumnId após deleção

### Testes E2E

- [ ] Testes de endpoints completos
- [ ] Setup de servidor de teste

### Cobertura

- [ ] Cobertura mínima de 70% (verificar com `npm run test:coverage`)

---

## 🔧 Infraestrutura

### Banco de Dados

- [x] PostgreSQL configurado
- [x] Drizzle ORM configurado
- [x] Schema de banco de dados criado
- [x] Migrations criadas
- [x] Docker Compose para desenvolvimento
- [x] Variáveis de ambiente configuradas

### Servidor

- [x] Express configurado
- [x] TypeScript configurado
- [x] CORS habilitado
- [x] Body parser (JSON)
- [x] Tratamento de erros global
- [x] Logging de requisições
- [x] Health check endpoint (`/health`)

### Validação

- [x] Validação de entrada com Zod
- [x] Schemas de validação para todos os endpoints
- [x] Middleware de validação

---

## 📚 Documentação

- [x] README.md com instruções de instalação
- [x] Estrutura do projeto documentada
- [ ] Documentação de API (endpoints detalhados)
