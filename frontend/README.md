# Frontend - Mini-Kanban

Frontend da aplicação Mini-Kanban desenvolvido com React, TypeScript e Vite.

## Tecnologias

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server rápido
- **TanStack Query (React Query)** - Biblioteca para gerenciamento de estado assíncrono e cache de dados
- **Axios** - Cliente HTTP para comunicação com a API

## Estrutura do Projeto

```
src/
├── components/     # Componentes React
├── services/        # Serviços de API (funções puras)
├── types/          # Definições de tipos TypeScript
├── context/        # Context API para gerenciamento de estado
├── hooks/          # Custom hooks com React Query
│   ├── useBoards.ts    # Hooks para gerenciar quadros
│   ├── useColumns.ts   # Hooks para gerenciar colunas
│   └── useCards.ts     # Hooks para gerenciar cartões
├── utils/          # Funções utilitárias
├── App.tsx         # Componente principal
└── main.tsx        # Ponto de entrada da aplicação
```

## Configuração

### Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com a URL base da API:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

## Instalação

```bash
npm install
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Build

Para criar uma build de produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/`.

## Preview da Build

Para visualizar a build de produção localmente:

```bash
npm run preview
```

## Linting

Para verificar o código com ESLint:

```bash
npm run lint
```
