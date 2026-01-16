# Mini-Kanban - Desafio Full-Stack

Aplicação de quadro Kanban desenvolvida como parte de um desafio técnico Full-Stack. O projeto consiste em uma API REST (backend) e uma interface web interativa (frontend) para gerenciar boards, colunas e cards com funcionalidade de drag-and-drop.

## � Contexto do Projeto

Este projeto foi desenvolvido como resposta ao **Desafio Prático Full-Stack** que propõe a criação de um sistema Mini-Kanban com os seguintes requisitos principais:

### Requisitos Funcionais
- **Boards (Quadros)**: Criar e visualizar quadros Kanban
- **Columns (Colunas)**: Adicionar colunas aos quadros (ex: "A Fazer", "Em Progresso", "Concluído")
- **Cards (Cartões)**: Criar, editar, excluir e mover cartões entre colunas
- **Drag and Drop**: Arrastar e soltar cartões entre colunas de forma intuitiva

### Requisitos Técnicos
- **Backend**: API REST com Node.js, TypeScript, Express e PostgreSQL
- **Frontend**: Interface com React, TypeScript e biblioteca de drag-and-drop
- **Arquitetura**: Clean Architecture no backend com SOLID e DDD
- **Testes**: Testes unitários, integração e E2E
- **Regra de Negócio Crítica**: Cards só podem ser movidos entre colunas do mesmo board

## 🗂️ Estrutura do Projeto

```
uds-test/
├── backend/          # API REST
├── frontend/         # Interface web
└── README.md         # Este arquivo
```

## 📚 Documentação

### Backend
- **[backend/README.md](./backend/README.md)** - Instruções de instalação, configuração e execução da API
- **[backend/CHECKLIST.md](./backend/CHECKLIST.md)** - Checklist detalhado do progresso do backend (~90% completo)

### Frontend
- **[frontend/README.md](./frontend/README.md)** - Instruções de instalação, configuração e execução da interface
- **[frontend/CHECKLIST.md](./frontend/CHECKLIST.md)** - Checklist detalhado do progresso do frontend (~90% completo)

## �️ Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **Drizzle ORM** - ORM para TypeScript
- **Jest** - Framework de testes
- **Zod** - Validação de schemas

### Frontend
- **React 19** com **TypeScript**
- **Vite** - Build tool e dev server
- **TanStack Query (React Query)** - Gerenciamento de estado assíncrono
- **@dnd-kit** - Biblioteca de drag-and-drop
- **Tailwind CSS v4** - Framework CSS
- **React Hook Form** + **Zod** - Validação de formulários
- **Axios** - Cliente HTTP

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose (para o banco de dados PostgreSQL)
- npm ou yarn

### 1. Backend

```bash
# Navegar para a pasta do backend
cd backend

# Instalar dependências
npm install

# Iniciar o banco de dados PostgreSQL com Docker
docker-compose up -d

# Executar migrations do banco de dados
npm run db:push

# Iniciar o servidor em modo desenvolvimento
npm run dev
```

O backend estará disponível em `http://localhost:3000`

📖 **Mais detalhes**: [backend/README.md](./backend/README.md)

### 2. Frontend

```bash
# Navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Copiar arquivo de variáveis de ambiente
cp .env.example .env

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

📖 **Mais detalhes**: [frontend/README.md](./frontend/README.md)

## ✅ Status do Projeto

### Backend (~90% completo)
- ✅ Arquitetura Clean Architecture implementada
- ✅ Todos os endpoints funcionais (boards, columns, cards)
- ✅ Regra de negócio crítica implementada e testada
- ✅ Testes unitários de entidades e use cases
- ✅ Testes de integração dos repositórios (45 testes passando)
- ✅ Validações com Zod
- ⚠️ Pendente: Testes E2E e documentação Swagger

### Frontend (~90% completo)
- ✅ Estrutura de features implementada
- ✅ Todos os componentes principais criados
- ✅ Drag and drop funcional com @dnd-kit
- ✅ Integração completa com API usando React Query
- ✅ Validação de formulários com React Hook Form + Zod
- ✅ Estados de loading e erro
- ⚠️ Pendente: Testes, optimistic updates, melhorias de acessibilidade

## � Próximos Passos

Consulte os checklists detalhados para acompanhar o progresso e próximas tarefas:
- [backend/CHECKLIST.md](./backend/CHECKLIST.md)
- [frontend/CHECKLIST.md](./frontend/CHECKLIST.md)
