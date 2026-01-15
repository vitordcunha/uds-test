import { BoardRepository } from "../../../src/infrastructure/database/repositories/BoardRepository";
import { Board } from "../../../src/domain/entities/Board";
import { Column } from "../../../src/domain/entities/Column";
import {
  createTestDb,
  cleanDatabase,
  closeDatabase,
} from "../helpers/database";
import { ColumnRepository } from "../../../src/infrastructure/database/repositories/ColumnRepository";

describe("BoardRepository Integration Tests", () => {
  let boardRepository: BoardRepository;
  let columnRepository: ColumnRepository;
  let testDb: ReturnType<typeof createTestDb>;

  beforeAll(() => {
    testDb = createTestDb();
    boardRepository = new BoardRepository();
    columnRepository = new ColumnRepository();
  });

  beforeEach(async () => {
    await cleanDatabase(testDb.db);
  });

  afterAll(async () => {
    await cleanDatabase(testDb.db);
    await closeDatabase(testDb.pool);
  });

  describe("findAll()", () => {
    it("should return all boards", async () => {
      // Arrange - Create multiple boards
      const board1 = new Board("Board 1");
      const board2 = new Board("Board 2");
      const board3 = new Board("Board 3");

      const createdBoard1 = await boardRepository.create(board1);
      const createdBoard2 = await boardRepository.create(board2);
      const createdBoard3 = await boardRepository.create(board3);

      // Act
      const result = await boardRepository.findAll();

      // Assert
      expect(result.length).toBeGreaterThanOrEqual(3);
      const resultIds = result.map((b) => b.id);
      expect(resultIds).toContain(createdBoard1.id);
      expect(resultIds).toContain(createdBoard2.id);
      expect(resultIds).toContain(createdBoard3.id);

      const resultNames = result.map((b) => b.name);
      expect(resultNames).toContain("Board 1");
      expect(resultNames).toContain("Board 2");
      expect(resultNames).toContain("Board 3");
    });

    it("should return empty array when no boards exist", async () => {
      // Act
      const result = await boardRepository.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("findById()", () => {
    it("should return board when exists", async () => {
      // Arrange
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      // Act
      const result = await boardRepository.findById(createdBoard.id!);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdBoard.id);
      expect(result?.name).toBe("Test Board");
    });

    it("should return null when board does not exist", async () => {
      // Arrange
      const nonExistentId = "00000000-0000-0000-0000-000000000000";

      // Act
      const result = await boardRepository.findById(nonExistentId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("findByColumnId()", () => {
    it("should return board when column exists", async () => {
      // Arrange - Create board and column
      const board = new Board("Test Board");
      const createdBoard = await boardRepository.create(board);

      const column = new Column("Test Column", createdBoard.id!);
      const createdColumn = await columnRepository.create(column);

      // Act
      const result = await boardRepository.findByColumnId(createdColumn.id!);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.id).toBe(createdBoard.id);
      expect(result?.name).toBe("Test Board");
      expect(result?.hasColumn(createdColumn.id!)).toBe(true);
    });

    it("should return null when column does not exist", async () => {
      // Arrange
      const nonExistentColumnId = "00000000-0000-0000-0000-000000000000";

      // Act
      const result = await boardRepository.findByColumnId(nonExistentColumnId);

      // Assert
      expect(result).toBeNull();
    });

    it("should return board with all its columns", async () => {
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
      const result = await boardRepository.findByColumnId(createdColumn1.id!);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.hasColumn(createdColumn1.id!)).toBe(true);
      expect(result?.hasColumn(createdColumn2.id!)).toBe(true);
      expect(result?.hasColumn(createdColumn3.id!)).toBe(true);
    });
  });

  describe("create()", () => {
    it("should create board successfully", async () => {
      // Arrange
      const board = new Board("New Board");

      // Act
      const result = await boardRepository.create(board);

      // Assert
      expect(result).toBeInstanceOf(Board);
      expect(result.id).toBeDefined();
      expect(result.name).toBe("New Board");
    });

    it("should create board with generated ID", async () => {
      // Arrange
      const board = new Board("Board Without ID");

      // Act
      const result = await boardRepository.create(board);

      // Assert
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe("string");
      expect(result.id!.length).toBeGreaterThan(0);
    });

    it("should persist board in database", async () => {
      // Arrange
      const board = new Board("Persisted Board");

      // Act
      const createdBoard = await boardRepository.create(board);
      const retrievedBoard = await boardRepository.findById(createdBoard.id!);

      // Assert
      expect(retrievedBoard).not.toBeNull();
      expect(retrievedBoard?.id).toBe(createdBoard.id);
      expect(retrievedBoard?.name).toBe("Persisted Board");
    });

    it("should create multiple boards with different IDs", async () => {
      // Arrange
      const board1 = new Board("Board 1");
      const board2 = new Board("Board 2");

      // Act
      const createdBoard1 = await boardRepository.create(board1);
      const createdBoard2 = await boardRepository.create(board2);

      // Assert
      expect(createdBoard1.id).toBeDefined();
      expect(createdBoard2.id).toBeDefined();
      expect(createdBoard1.id).not.toBe(createdBoard2.id);
    });
  });
});
