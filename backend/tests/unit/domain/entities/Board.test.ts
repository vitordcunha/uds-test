import { Board } from '../../../../src/domain/entities/Board';
import { DomainException } from '../../../../src/domain/exceptions/DomainException';

describe('Board Entity', () => {
  describe('Creation', () => {
    it('should create a valid board', () => {
      const board = new Board('Test Board', 'board-1');
      
      expect(board.name).toBe('Test Board');
      expect(board.id).toBe('board-1');
    });

    it('should throw error when name is empty', () => {
      expect(() => new Board('')).toThrow(DomainException);
      expect(() => new Board('')).toThrow('Board name is required');
    });

    it('should throw error when name exceeds 255 characters', () => {
      const longName = 'a'.repeat(256);
      expect(() => new Board(longName)).toThrow(DomainException);
    });
  });

  describe('addColumn', () => {
    it('should add a column to the board', () => {
      const board = new Board('Test Board');
      board.addColumn('column-1');
      
      expect(board.hasColumn('column-1')).toBe(true);
    });

    it('should not add duplicate columns', () => {
      const board = new Board('Test Board');
      board.addColumn('column-1');
      board.addColumn('column-1');
      
      expect(board.hasColumn('column-1')).toBe(true);
    });
  });

  describe('hasColumn', () => {
    it('should return false when column does not exist', () => {
      const board = new Board('Test Board');
      
      expect(board.hasColumn('column-1')).toBe(false);
    });
  });
});
