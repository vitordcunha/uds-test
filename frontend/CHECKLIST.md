# ✅ Checklist Frontend - Desafio Full-Stack Kanban

## 📋 Requisitos Funcionais

### Boards (Quadros)

- [x] **Listagem de boards** - Visualizar todos os boards criados
- [x] **Criação de board** - Formulário para criar novo board
- [x] **Visualização de board** - Ver board completo com colunas e cards
- [x] **Navegação** - Navegar entre lista de boards e visualização de board

### Columns (Colunas)

- [x] **Visualização de colunas** - Exibir colunas do board
- [x] **Criação de coluna** - Formulário para criar nova coluna
- [x] **Ordenação** - Colunas exibidas em ordem correta

### Cards (Cartões)

- [x] **Visualização de cards** - Exibir cards dentro das colunas
- [x] **Criação de card** - Formulário para criar novo card
- [x] **Edição de card** - Formulário para editar card existente
- [x] **Exclusão de card** - Dialog de confirmação para deletar card
- [x] **Drag and Drop** - Mover cards entre colunas com drag and drop
  - [x] Biblioteca @dnd-kit implementada
  - [x] Feedback visual durante drag
  - [x] Funciona em desktop
  - [ ] Verificar funcionamento em mobile

### Validação de Formulários

- [x] Validação de nome do board (obrigatório, máximo 255 caracteres)
- [x] Validação de nome da coluna (obrigatório, máximo 255 caracteres)
- [x] Validação de título do card (obrigatório, máximo 255 caracteres)
- [x] Validação com Zod + React Hook Form
- [x] Mensagens de erro exibidas

### Estados de Loading e Erro

- [x] Loading ao carregar board
- [x] Tratamento de erros ao carregar board
- [x] Loading durante mutações (criar, atualizar, deletar)
- [x] Feedback visual durante operações

---

## 🏗️ Arquitetura

### Estrutura de Pastas (Feature-Based)

- [x] **features/** - Funcionalidades organizadas por domínio

  - [x] `boards/` - Componentes e lógica de boards
  - [x] `columns/` - Componentes e lógica de colunas
  - [x] `cards/` - Componentes e lógica de cards

- [x] **shared/** - Componentes e utilitários compartilhados

  - [x] `components/ui/` - Componentes de UI reutilizáveis
    - [x] `Button`
    - [x] `Input`
    - [x] `Textarea`
    - [x] `Modal`
  - [x] `components/feedback/` - Componentes de feedback
    - [x] `ConfirmDialog`
  - [x] `utils/` - Utilitários
    - [x] `validation.ts` - Schemas Zod
    - [x] `cn.ts` - Utilitário de classes CSS

- [x] **hooks/** - Custom hooks com React Query

  - [x] `useBoards.ts` - Hooks para gerenciar boards
  - [x] `useColumns.ts` - Hooks para gerenciar colunas
  - [x] `useCards.ts` - Hooks para gerenciar cards

- [x] **services/** - Serviços de API

  - [x] `api.ts` - Cliente Axios configurado

- [x] **types/** - Definições de tipos TypeScript
  - [x] Tipos para Board, Column, Card

---

## 🎨 UI/UX

### Componentes Principais

- [x] **BoardList** - Lista de boards
- [x] **BoardView** - Visualização completa do board
- [x] **Column** - Componente de coluna com droppable
- [x] **Card** - Componente de card com sortable
- [x] **CreateBoardForm** - Formulário de criação de board
- [x] **CreateColumnForm** - Formulário de criação de coluna
- [x] **CreateCardForm** - Formulário de criação de card
- [x] **EditCardForm** - Formulário de edição de card

### Drag and Drop

- [x] Implementado com @dnd-kit
- [x] DndContext configurado
- [x] SortableContext para cards
- [x] useDroppable para colunas
- [x] useSortable para cards
- [x] DragOverlay para feedback visual
- [x] PointerSensor com activationConstraint (8px)
- [x] Integração com API ao soltar card

### Responsividade

- [x] Layout responsivo básico
- [ ] Testar em diferentes tamanhos de tela
- [ ] Otimizar para mobile

### Acessibilidade

- [x] Estrutura semântica HTML
- [ ] Adicionar ARIA labels
- [ ] Suporte a navegação por teclado

---

## 🔌 Integração com API

### Hooks Customizados (React Query)

- [x] `useBoards` - Buscar boards
- [x] `useBoard` - Buscar board por ID
- [x] `useCreateBoard` - Criar board
- [x] `useCreateColumn` - Criar coluna
- [x] `useCreateCard` - Criar card
- [x] `useUpdateCard` - Atualizar card
- [x] `useDeleteCard` - Deletar card
- [x] `useMoveCard` - Mover card entre colunas

### Otimistic Updates

- [x] Invalidação de cache após mutações
- [x] Refetch automático após operações
- [ ] Implementar optimistic updates para melhor UX

### Tratamento de Erros

- [x] Tratamento de erros nas queries
- [x] Tratamento de erros nas mutations
- [x] Mensagens de erro exibidas ao usuário

---

## 🛠️ Tecnologias

### Core

- [x] React 19
- [x] TypeScript
- [x] Vite

### Gerenciamento de Estado

- [x] TanStack Query (React Query)
- [x] Wouter (roteamento)

### Estilização

- [x] Tailwind CSS v4
- [x] Classes utilitárias configuradas

### Drag and Drop

- [x] @dnd-kit/core
- [x] @dnd-kit/sortable
- [x] @dnd-kit/utilities

### Formulários

- [x] React Hook Form
- [x] Zod (validação)
- [x] @hookform/resolvers

### HTTP Client

- [x] Axios
- [x] Configuração de base URL
- [x] Interceptors (se necessário)

### Ícones

- [x] Lucide React

---

## 🧪 Testes

- [ ] Testes unitários de componentes
- [ ] Testes de integração
- [ ] Testes E2E
- [ ] Testes de acessibilidade

---

## 📱 Responsividade e Mobile

- [x] Layout básico responsivo
- [ ] Testar drag and drop em dispositivos móveis
- [ ] Otimizar touch events
- [ ] Ajustar tamanhos de fonte e espaçamentos

---

## 🐛 Problemas Conhecidos

- [ ] Verificar funcionamento completo do drag and drop em mobile
- [ ] Melhorar feedback visual durante operações assíncronas
- [ ] Adicionar loading states mais visíveis
