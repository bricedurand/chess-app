import { describe, it, expect, beforeEach } from '@jest/globals';
import { Game } from '../models/Game';
import { Board } from '../models/Board';

describe('Chess Game', () => {
  let game: Game;
  let board: Board;

  beforeEach(() => {
    game = new Game();
    board = game.getBoard();
  });

  describe('Board Setup', () => {
    it('should initialize with correct piece positions', () => {
      // Check white pieces
      expect(board.getPiece('a1')?.name).toBe('rook');
      expect(board.getPiece('a1')?.color).toBe('white');
      expect(board.getPiece('e1')?.name).toBe('king');
      expect(board.getPiece('e1')?.color).toBe('white');
      
      // Check black pieces
      expect(board.getPiece('a8')?.name).toBe('rook');
      expect(board.getPiece('a8')?.color).toBe('black');
      expect(board.getPiece('e8')?.name).toBe('king');
      expect(board.getPiece('e8')?.color).toBe('black');
    });

    it('should have empty squares in the middle', () => {
      expect(board.getPiece('e4')).toBeUndefined();
      expect(board.getPiece('d5')).toBeUndefined();
    });

    it('should display board correctly', () => {
      const boardString = game.getBoardString();
      expect(boardString).toContain('♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜'); // Black pieces
      expect(boardString).toContain('♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟'); // Black pawns
      expect(boardString).toContain('♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙'); // White pawns
      expect(boardString).toContain('♖ ♘ ♗ ♕ ♔ ♗ ♘ ♖'); // White pieces
    });
  });

  describe('Player Switching', () => {
    it('should start with white player', () => {
      expect(game.getCurrentPlayer()).toBe('white');
    });

    it('should switch players after each move', () => {
      expect(game.getCurrentPlayer()).toBe('white');
      
      game.makeMove('e2', 'e4');
      expect(game.getCurrentPlayer()).toBe('black');
      
      game.makeMove('e7', 'e5');
      expect(game.getCurrentPlayer()).toBe('white');
    });
  });

  describe('Piece Movements', () => {
    it('should allow pawn to move forward one square', () => {
      expect(game.makeMove('e2', 'e3')).toBe(true);
    });

    it('should allow pawn to move forward two squares from starting position', () => {
      expect(game.makeMove('e2', 'e4')).toBe(true);
    });

    it('should allow knight to move in L-shape', () => {
      expect(game.makeMove('g1', 'f3')).toBe(true);
    });

    it('should allow bishop to move diagonally', () => {
      game.makeMove('e2', 'e4');
      game.makeMove('e7', 'e5');
      
      expect(game.makeMove('f1', 'c4')).toBe(true);
    });

    it('should allow rook to move horizontally and vertically', () => {
      game.makeMove('h2', 'h4');
      game.makeMove('e7', 'e5');
      
      expect(game.makeMove('h1', 'h3')).toBe(true);
    });

    it('should allow queen to move diagonally', () => {
      game.makeMove('e2', 'e4');
      game.makeMove('e7', 'e5');
      
      expect(game.makeMove('d1', 'h5')).toBe(true);
    });

    it('should allow queen to move horizontally', () => {
      game.makeMove('d2', 'd4');
      game.makeMove('e7', 'e5');
      
      expect(game.makeMove('d1', 'd3')).toBe(true);
    });

    it('should reject invalid piece movements', () => {
      expect(() => {
        game.makeMove('e2', 'e6'); // Pawn can't move 4 squares
      }).toThrow('Invalid move');
    });

    it('should reject moves from empty squares', () => {
      expect(() => {
        game.makeMove('e3', 'e4');
      }).toThrow('No piece at e3');
    });

    it('should reject moves to invalid squares', () => {
      expect(() => {
        game.makeMove('e2', 'e9');
      }).toThrow('Invalid square notation');
    });
  });

  describe('Captured Pieces', () => {
    it('should track captured pieces when capture occurs', () => {
      // Move white pawn
      game.makeMove('e2', 'e4');
      game.makeMove('e7', 'e5');
      
      // Move white pawn to d4 to prepare for capture
      game.makeMove('d2', 'd4');
      game.makeMove('d7', 'd5');
      
      // Capture black pawn (it's white's turn)
      game.makeMove('d4', 'd5');
      
      const gameState = game.getGameState();
      expect(gameState.capturedPieces.length).toBe(1);
      expect(gameState.capturedPieces[0].name).toBe('pawn');
      expect(gameState.capturedPieces[0].color).toBe('black');
    });

    it('should not track captured pieces when no capture occurs', () => {
      game.makeMove('e2', 'e4');
      game.makeMove('e7', 'e5');
      game.makeMove('g1', 'f3');

      const gameState = game.getGameState();
      expect(gameState.capturedPieces.length).toBe(0);
    });
  });

  describe('Move History', () => {
    it('should start with empty move history', () => {
      expect(game.getMoveHistory()).toHaveLength(0);
    });

    it('should track moves correctly', () => {
      game.makeMove('e2', 'e4');
      game.makeMove('e7', 'e5');
      game.makeMove('g1', 'f3');
      game.makeMove('b8', 'c6');

      const moveHistory = game.getMoveHistory();
      expect(moveHistory).toHaveLength(4);

      // Check first move
      expect(moveHistory[0].from).toBe('e2');
      expect(moveHistory[0].to).toBe('e4');
      expect(moveHistory[0].piece.name).toBe('pawn');
      expect(moveHistory[0].piece.color).toBe('white');

      // Check second move
      expect(moveHistory[1].from).toBe('e7');
      expect(moveHistory[1].to).toBe('e5');
      expect(moveHistory[1].piece.name).toBe('pawn');
      expect(moveHistory[1].piece.color).toBe('black');

      // Check third move
      expect(moveHistory[2].from).toBe('g1');
      expect(moveHistory[2].to).toBe('f3');
      expect(moveHistory[2].piece.name).toBe('knight');
      expect(moveHistory[2].piece.color).toBe('white');
    });

    it('should track capture moves correctly', () => {
      game.makeMove('e2', 'e4');
      game.makeMove('e7', 'e5');
      game.makeMove('d2', 'd4');
      game.makeMove('d7', 'd5');
      game.makeMove('d4', 'd5'); // Capture (white's turn)

      const moveHistory = game.getMoveHistory();
      const captureMove = moveHistory[4];
      
      expect(captureMove.isCapture).toBe(true);
      expect(captureMove.piece.name).toBe('pawn');
      expect(captureMove.piece.color).toBe('white');
    });
  });

  describe('Game State', () => {
    it('should maintain proper game state throughout play', () => {
      const initialState = game.getGameState();
      expect(initialState.currentPlayer).toBe('white');
      expect(initialState.isGameOver).toBe(false);
      expect(initialState.moveHistory).toHaveLength(0);

      game.makeMove('e2', 'e4');
      const afterFirstMove = game.getGameState();
      expect(afterFirstMove.currentPlayer).toBe('black');
      expect(afterFirstMove.moveHistory).toHaveLength(1);
    });

    it('should not be game over initially', () => {
      const gameState = game.getGameState();
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.winner).toBeUndefined();
    });
  });

  describe('Board Updates', () => {
    it('should update board after moves', () => {
      game.makeMove('e2', 'e4');
      const boardString = game.getBoardString();
      
      // Check that the board shows the moved pawn
      expect(boardString).toContain('4 · · · · ♙ · · · 4'); // e4 has pawn
      expect(boardString).toContain('2 ♙ ♙ ♙ ♙ · ♙ ♙ ♙ 2'); // e2 is empty
    });
  });
});
