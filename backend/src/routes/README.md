# Routes Documentation

This directory contains Express route handlers for the Kanban Board API.

## Route Files

### `boards.ts`
- **GET** `/api/boards` - Get all boards (placeholder)
- **GET** `/api/boards/:id` - Get board by ID (placeholder)
- **POST** `/api/boards` - Create a new board (placeholder)

### `columns.ts`
- **POST** `/api/boards/:boardId/columns` - Create a new column (placeholder)

### `cards.ts`
- **POST** `/api/columns/:columnId/cards` - Create a new card (placeholder)

### `cardOperations.ts`
- **PUT** `/api/cards/:id` - Update a card (placeholder)
- **DELETE** `/api/cards/:id` - Delete a card (placeholder)
- **Note:** `PATCH /api/cards/:id/move` route has been moved to `CardController` (see `src/presentation/http/controllers/CardController.ts`)

## Implemented Routes

The following routes are fully implemented with use cases, repositories, and domain logic:

- **PATCH** `/api/cards/:id/move` - Move a card to a different column
  - Controller: `CardController.moveCard()`
  - Use Case: `MoveCardBetweenColumns`
  - Location: `src/index.ts` (direct route registration)

## Route Migration Notes

As the application evolves, placeholder routes should be migrated to follow the same pattern:
1. Create use cases in `src/application/use-cases/`
2. Create controllers in `src/presentation/http/controllers/`
3. Register routes in `src/index.ts` with dependency injection
4. Remove placeholder implementations from route files

## Architecture

Routes follow a layered architecture:
- **Routes** (`src/routes/`) - Express route definitions (legacy/placeholder)
- **Controllers** (`src/presentation/http/controllers/`) - HTTP request handling
- **Use Cases** (`src/application/use-cases/`) - Business logic
- **Repositories** (`src/infrastructure/database/repositories/`) - Data access
