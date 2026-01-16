import { CardRepository } from "../../../src/infrastructure/database/repositories/CardRepository";
import { Card } from "../../../src/domain/entities/Card";
import { Column } from "../../../src/domain/entities/Column";
import { Board } from "../../../src/domain/entities/Board";
import {
  createTestDb,
  cleanDatabase,
  closeDatabase,
} from "../helpers/database";
import { ColumnRepository } from "../../../src/infrastructure/database/repositories/ColumnRepository";
import { BoardRepository } from "../../../src/infrastructure/database/repositories/BoardRepository";

describe("CardRepository Integration Tests", () => {
  let cardRepository: CardRepository;
  let columnRepository: ColumnRepository;
  let boardRepository: BoardRepository;
  let testDb: ReturnType<typeof createTestDb>;

  beforeAll(() => {
    testDb = createTestDb();
    cardRepository = new CardRepository();
    columnRepository = new ColumnRepository();
    boardRepository = new BoardRepository();
  });

  beforeEach(async () => {
    await cleanDatabase(testDb.db);
  });

  afterAll(async () => {
    await cleanDatabase(testDb.db);
    await closeDatabase(testDb.pool);
  });

  describe("findById()", () => {
    it("should return card when exists", async () => {
      // Arrange - Create board, column and card
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card("Test Card", createdColumn.id!);
      const createdCard = await cardRepository.create(card);

      // Act
      const result = await cardRepository.findById(createdCard.id!);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdCard.id);
      expect(result?.title).toBe("Test Card");
      expect(result?.columnId).toBe(createdColumn.id);
    });

    it("should return null when card does not exist", async () => {
      // Arrange
      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      // Act
      const result = await cardRepository.findById(nonExistentId);

      // Assert
      expect(result).toBeNull();
    });

    it("should return card with description when set", async () => {
      // Arrange - Create board, column and card with description
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card("Test Card", createdColumn.id!, "Test Description");
      const createdCard = await cardRepository.create(card);

      // Act
      const result = await cardRepository.findById(createdCard.id!);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.description).toBe("Test Description");
    });
  });

  describe("findByColumnId()", () => {
    it("should return cards of a column", async () => {
      // Arrange - Create board, column and multiple cards
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card1 = new Card("Card 1", createdColumn.id!);
      const card2 = new Card("Card 2", createdColumn.id!);
      const card3 = new Card("Card 3", createdColumn.id!);

      const createdCard1 = await cardRepository.create(card1);
      const createdCard2 = await cardRepository.create(card2);
      const createdCard3 = await cardRepository.create(card3);

      // Act
      const result = await cardRepository.findByColumnId(createdColumn.id!);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(3);
      const resultIds = result.map((c) => c.id);
      expect(resultIds).toContain(createdCard1.id);
      expect(resultIds).toContain(createdCard2.id);
      expect(resultIds).toContain(createdCard3.id);
      expect(result.every((c) => c.columnId === createdColumn.id)).toBe(true);
    });

    it("should return empty array when column has no cards", async () => {
      // Arrange - Create board and column without cards
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Empty Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      // Act
      const result = await cardRepository.findByColumnId(createdColumn.id!);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return empty array when column does not exist", async () => {
      // Arrange
      const nonExistentColumnId = "00000000-0000-0000-0000-000000000000";

      // Act
      const result = await cardRepository.findByColumnId(nonExistentColumnId);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("create()", () => {
    it("should create card successfully", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card("New Card", createdColumn.id!);

      // Act
      const result = await cardRepository.create(card);

      // Assert
      expect(result).toBeInstanceOf(Card);
      expect(result.id).toBeDefined();
      expect(result.title).toBe("New Card");
      expect(result.columnId).toBe(createdColumn.id);
    });

    it("should create card with generated ID", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card("Card Without ID", createdColumn.id!);

      // Act
      const result = await cardRepository.create(card);

      // Assert
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe("string");
      expect(result.id!.length).toBeGreaterThan(0);
    });

    it("should create card with description when provided", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card(
        "Card With Description",
        createdColumn.id!,
        "Card Description"
      );

      // Act
      const result = await cardRepository.create(card);

      // Assert
      expect(result.description).toBe("Card Description");
    });

    it("should persist card in database", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card(
        "Persisted Card",
        createdColumn.id!,
        "Persisted Description"
      );

      // Act
      const createdCard = await cardRepository.create(card);
      const retrievedCard = await cardRepository.findById(createdCard.id!);

      // Assert
      expect(retrievedCard).not.toBeNull();
      expect(retrievedCard?.id).toBe(createdCard.id);
      expect(retrievedCard?.title).toBe("Persisted Card");
      expect(retrievedCard?.description).toBe("Persisted Description");
      expect(retrievedCard?.columnId).toBe(createdColumn.id);
    });

    it("should create multiple cards with different IDs", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card1 = new Card("Card 1", createdColumn.id!);
      const card2 = new Card("Card 2", createdColumn.id!);

      // Act
      const createdCard1 = await cardRepository.create(card1);
      const createdCard2 = await cardRepository.create(card2);

      // Assert
      expect(createdCard1.id).toBeDefined();
      expect(createdCard2.id).toBeDefined();
      expect(createdCard1.id).not.toBe(createdCard2.id);
    });
  });

  describe("update()", () => {
    it("should update card title", async () => {
      // Arrange - Create card
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card("Original Title", createdColumn.id!);
      const createdCard = await cardRepository.create(card);

      // Update title
      createdCard.updateTitle("Updated Title");

      // Act
      const result = await cardRepository.update(createdCard);

      // Assert
      expect(result.title).toBe("Updated Title");
      expect(result.id).toBe(createdCard.id);
      expect(result.columnId).toBe(createdColumn.id);

      // Verify persistence
      const retrievedCard = await cardRepository.findById(createdCard.id!);
      expect(retrievedCard?.title).toBe("Updated Title");
    });

    it("should update card description", async () => {
      // Arrange - Create card with description
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card(
        "Test Card",
        createdColumn.id!,
        "Original Description"
      );
      const createdCard = await cardRepository.create(card);

      // Update description
      createdCard.updateDescription("Updated Description");

      // Act
      const result = await cardRepository.update(createdCard);

      // Assert
      expect(result.description).toBe("Updated Description");

      // Verify persistence
      const retrievedCard = await cardRepository.findById(createdCard.id!);
      expect(retrievedCard?.description).toBe("Updated Description");
    });

    it("should update card columnId", async () => {
      // Arrange - Create board with two columns
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column1 = new Column("Column 1", createdBoard.id!);
      const column2 = new Column("Column 2", createdBoard.id!);
      const createdColumn1 = await columnRepository.create(column1);
      const createdColumn2 = await columnRepository.create(column2);

      // Add columns to board for validation
      board.addColumn(createdColumn1.id!);
      board.addColumn(createdColumn2.id!);

      const card = new Card("Test Card", createdColumn1.id!);
      const createdCard = await cardRepository.create(card);

      // Move card to column2
      createdCard.moveToColumn(createdColumn2.id!, board);

      // Act
      const result = await cardRepository.update(createdCard);

      // Assert
      expect(result.columnId).toBe(createdColumn2.id);

      // Verify persistence
      const retrievedCard = await cardRepository.findById(createdCard.id!);
      expect(retrievedCard?.columnId).toBe(createdColumn2.id);
    });

    it("should update both title and description", async () => {
      // Arrange - Create card
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card(
        "Original Title",
        createdColumn.id!,
        "Original Description"
      );
      const createdCard = await cardRepository.create(card);

      // Update both
      createdCard.updateTitle("New Title");
      createdCard.updateDescription("New Description");

      // Act
      const result = await cardRepository.update(createdCard);

      // Assert
      expect(result.title).toBe("New Title");
      expect(result.description).toBe("New Description");

      // Verify persistence
      const retrievedCard = await cardRepository.findById(createdCard.id!);
      expect(retrievedCard?.title).toBe("New Title");
      expect(retrievedCard?.description).toBe("New Description");
    });

    it("should throw error when updating card without id", async () => {
      // Arrange - Create card without id
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card("Test Card", createdColumn.id!);

      // Act & Assert
      await expect(cardRepository.update(card)).rejects.toThrow(
        "Card must have an id to be updated"
      );
    });

    it("should throw error when updating card that does not exist in database", async () => {
      // Arrange - Create board and column, but not the card
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      // Create card with ID but don't persist it
      const nonExistentId = "00000000-0000-0000-0000-000000000000";
      const card = new Card("Non-existent Card", createdColumn.id!, undefined, nonExistentId);

      // Act & Assert
      // The update will try to update a non-existent card, which should cause an error
      await expect(cardRepository.update(card)).rejects.toThrow();
    });
  });

  describe("delete()", () => {
    it("should delete card successfully", async () => {
      // Arrange - Create card
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card = new Card("Card To Delete", createdColumn.id!);
      const createdCard = await cardRepository.create(card);

      // Verify card exists
      const cardBeforeDelete = await cardRepository.findById(createdCard.id!);
      expect(cardBeforeDelete).not.toBeNull();

      // Act
      await cardRepository.delete(createdCard.id!);

      // Assert
      const cardAfterDelete = await cardRepository.findById(createdCard.id!);
      expect(cardAfterDelete).toBeNull();
    });

    it("should not throw error when deleting non-existent card", async () => {
      // Arrange
      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      // Act & Assert
      await expect(cardRepository.delete(nonExistentId)).resolves.not.toThrow();
    });

    it("should remove card from findByColumnId results after deletion", async () => {
      // Arrange - Create multiple cards
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      const card1 = new Card("Card 1", createdColumn.id!);
      const card2 = new Card("Card 2", createdColumn.id!);
      const card3 = new Card("Card 3", createdColumn.id!);

      const createdCard1 = await cardRepository.create(card1);
      const createdCard2 = await cardRepository.create(card2);
      const createdCard3 = await cardRepository.create(card3);

      // Verify all cards exist
      const cardsBeforeDelete = await cardRepository.findByColumnId(
        createdColumn.id!
      );
      expect(cardsBeforeDelete.length).toBeGreaterThanOrEqual(3);

      // Act - Delete one card
      await cardRepository.delete(createdCard2.id!);

      // Assert
      const cardsAfterDelete = await cardRepository.findByColumnId(
        createdColumn.id!
      );
      const cardIds = cardsAfterDelete.map((c) => c.id);
      expect(cardIds).not.toContain(createdCard2.id);
      expect(cardIds).toContain(createdCard1.id);
      expect(cardIds).toContain(createdCard3.id);
    });
  });
});
