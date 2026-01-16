import { ColumnRepository } from "../../../src/infrastructure/database/repositories/ColumnRepository";
import { Column } from "../../../src/domain/entities/Column";
import { Board } from "../../../src/domain/entities/Board";
import {
  createTestDb,
  cleanDatabase,
  closeDatabase,
} from "../helpers/database";
import { BoardRepository } from "../../../src/infrastructure/database/repositories/BoardRepository";

describe("ColumnRepository Integration Tests", () => {
  let columnRepository: ColumnRepository;
  let boardRepository: BoardRepository;
  let testDb: ReturnType<typeof createTestDb>;

  beforeAll(() => {
    testDb = createTestDb();
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
    it("should return column when exists", async () => {
      // Arrange - Create board and column
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      // Act
      const result = await columnRepository.findById(createdColumn.id!);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdColumn.id);
      expect(result?.name).toBe("Test Column");
      expect(result?.boardId).toBe(createdBoard.id);
    });

    it("should return null when column does not exist", async () => {
      // Arrange
      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      // Act
      const result = await columnRepository.findById(nonExistentId);

      // Assert
      expect(result).toBeNull();
    });

    it("should return column with order when set", async () => {
      // Arrange - Create board and column with order
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column(
        "Ordered Column",
        createdBoard.id!,
        undefined,
        5
      );
      const createdColumn = await columnRepository.create(column);

      // Act
      const result = await columnRepository.findById(createdColumn.id!);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.order).toBe(5);
    });
  });

  describe("findByBoardId()", () => {
    it("should return columns of a board", async () => {
      // Arrange - Create board with multiple columns
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column1 = new Column("Column 1", createdBoard.id!);
      const column2 = new Column("Column 2", createdBoard.id!);
      const column3 = new Column("Column 3", createdBoard.id!);

      const createdColumn1 = await columnRepository.create(column1);
      const createdColumn2 = await columnRepository.create(column2);
      const createdColumn3 = await columnRepository.create(column3);

      // Act
      const result = await columnRepository.findByBoardId(createdBoard.id!);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(3);
      const resultIds = result.map((c) => c.id);
      expect(resultIds).toContain(createdColumn1.id);
      expect(resultIds).toContain(createdColumn2.id);
      expect(resultIds).toContain(createdColumn3.id);
      expect(result.every((c) => c.boardId === createdBoard.id)).toBe(true);
    });

    it("should return empty array when board has no columns", async () => {
      // Arrange - Create board without columns
      const board = new Board("Empty Board");
      const createdBoard = await boardRepository.create(board);

      // Act
      const result = await columnRepository.findByBoardId(createdBoard.id!);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return empty array when board does not exist", async () => {
      // Arrange
      const nonExistentBoardId = "00000000-0000-0000-0000-000000000000";

      // Act
      const result = await columnRepository.findByBoardId(nonExistentBoardId);

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should return columns ordered by order field", async () => {
      // Arrange - Create board with columns in different order
      const board = new Board("Ordered Board");
      const createdBoard = await boardRepository.create(board);

      const column1 = new Column("First", createdBoard.id!, undefined, 3);
      const column2 = new Column("Second", createdBoard.id!, undefined, 1);
      const column3 = new Column("Third", createdBoard.id!, undefined, 2);

      await columnRepository.create(column1);
      await columnRepository.create(column2);
      await columnRepository.create(column3);

      // Act
      const result = await columnRepository.findByBoardId(createdBoard.id!);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(3);
      // Check that columns are ordered by order field (ascending)
      const orders = result.map((c) => c.order ?? 0);
      const sortedOrders = [...orders].sort((a, b) => a - b);
      expect(orders).toEqual(sortedOrders);
    });

    it("should return columns with default order (0) when order not provided", async () => {
      // Arrange - Create columns with explicit order and without order (defaults to 0)
      const board = new Board("Mixed Order Board");
      const createdBoard = await boardRepository.create(board);

      const columnWithOrder = new Column(
        "Ordered",
        createdBoard.id!,
        undefined,
        1
      );
      const columnWithoutOrder = new Column("Default Order", createdBoard.id!);

      await columnRepository.create(columnWithOrder);
      await columnRepository.create(columnWithoutOrder);

      // Act
      const result = await columnRepository.findByBoardId(createdBoard.id!);

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(2);
      // Columns with explicit order should come first (order 1)
      // Columns without order get default value 0
      const orderedColumns = result.filter(
        (c) => c.order !== undefined && c.order !== 0
      );
      const defaultOrderColumns = result.filter((c) => c.order === 0);
      expect(orderedColumns.length).toBeGreaterThan(0);
      expect(defaultOrderColumns.length).toBeGreaterThan(0);
    });
  });

  describe("create()", () => {
    it("should create column successfully", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("New Column", createdBoard.id!);

      // Act
      const result = await columnRepository.create(column);

      // Assert
      expect(result).toBeInstanceOf(Column);
      expect(result.id).toBeDefined();
      expect(result.name).toBe("New Column");
      expect(result.boardId).toBe(createdBoard.id);
    });

    it("should create column with generated ID", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Column Without ID", createdBoard.id!);

      // Act
      const result = await columnRepository.create(column);

      // Assert
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe("string");
      expect(result.id!.length).toBeGreaterThan(0);
    });

    it("should create column with order when provided", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column(
        "Ordered Column",
        createdBoard.id!,
        undefined,
        10
      );

      // Act
      const result = await columnRepository.create(column);

      // Assert
      expect(result.order).toBe(10);
    });

    it("should persist column in database", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Persisted Column", createdBoard.id!);

      // Act
      const createdColumn = await columnRepository.create(column);
      const retrievedColumn = await columnRepository.findById(
        createdColumn.id!
      );

      // Assert
      expect(retrievedColumn).not.toBeNull();
      expect(retrievedColumn?.id).toBe(createdColumn.id);
      expect(retrievedColumn?.name).toBe("Persisted Column");
      expect(retrievedColumn?.boardId).toBe(createdBoard.id);
    });

    it("should create multiple columns with different IDs", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column1 = new Column("Column 1", createdBoard.id!);
      const column2 = new Column("Column 2", createdBoard.id!);

      // Act
      const createdColumn1 = await columnRepository.create(column1);
      const createdColumn2 = await columnRepository.create(column2);

      // Assert
      expect(createdColumn1.id).toBeDefined();
      expect(createdColumn2.id).toBeDefined();
      expect(createdColumn1.id).not.toBe(createdColumn2.id);
    });

    it("should create column with default order (0) when not provided", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("No Order Column", createdBoard.id!);

      // Act
      const result = await columnRepository.create(column);

      // Assert
      // Database returns 0 as default when order is not provided
      expect(result.order).toBe(0);
    });
  });
});
