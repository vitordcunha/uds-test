# Backend API - Kanban Board

Backend API desenvolvido com Node.js, TypeScript e Express para o sistema de Kanban Board.

## Requisitos

- Node.js 18+ 
- npm ou yarn
- Docker e Docker Compose (para o banco de dados PostgreSQL)

## Instalação

```bash
npm install
```

## Configuração do Banco de Dados (PostgreSQL)

O projeto utiliza PostgreSQL como banco de dados. Para facilitar o desenvolvimento, foi configurado um `docker-compose.yml` que cria uma instância PostgreSQL.

### Iniciar o banco de dados

```bash
cd backend
docker-compose up -d
```

Isso irá iniciar o PostgreSQL na porta `5432` com as seguintes configurações:
- **Database**: `kanban_board`
- **Username**: `postgres`
- **Password**: `postgres`
- **Port**: `5432`

### Parar o banco de dados

```bash
docker-compose down
```

### Parar e remover volumes (resetar o banco de dados)

```bash
docker-compose down -v
```

O banco de dados estará disponível em `localhost:5432` e corresponde à configuração do `DATABASE_URL` no arquivo `.env`. Os dados são persistidos em um volume Docker, então sobrevivem a reinicializações do container.

## Scripts

- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot-reload
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em produção (após build)
- `npm run lint` - Executa o linter

## Estrutura do Projeto

```
backend/
├── src/
│   ├── data/
│   │   └── store.ts          # Armazenamento em memória (temporário)
│   ├── routes/
│   │   ├── boards.ts         # Rotas para boards
│   │   ├── columns.ts        # Rotas para columns
│   │   └── cards.ts          # Rotas para cards
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript
│   └── index.ts              # Arquivo principal do servidor
├── dist/                     # Arquivos compilados (gerado)
├── package.json
├── tsconfig.json
└── README.md
```

## Endpoints da API

### Boards

- `GET /api/boards` - Lista todos os boards
- `GET /api/boards/:id` - Obtém um board por ID
- `POST /api/boards` - Cria um novo board

### Columns

- `POST /api/boards/:boardId/columns` - Cria uma nova coluna em um board

### Cards

- `POST /api/columns/:columnId/cards` - Cria um novo card em uma coluna
- `PUT /api/cards/:id` - Atualiza um card
- `DELETE /api/cards/:id` - Deleta um card
- `PATCH /api/cards/:id/move` - Move um card para outra coluna

## Variáveis de Ambiente

O servidor roda na porta 3000 por padrão. Para alterar, defina a variável `PORT`:

```bash
PORT=3001 npm run dev
```

## Desenvolvimento

O projeto usa `tsx` para execução direta de TypeScript em desenvolvimento, sem necessidade de compilação prévia.

## Notas

- O projeto utiliza PostgreSQL como banco de dados. Use o Docker Compose para iniciar o banco de dados localmente.
- O servidor está configurado com CORS habilitado para permitir requisições do frontend.
