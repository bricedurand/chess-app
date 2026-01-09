import { describe, it, expect, beforeEach } from '@jest/globals';
import { Game } from '../models/Game';
import { Board } from '../models/Board';
import { Square } from '../utils/Square';

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
      expect(board.getPiece(new Square('a1'))?.name).toBe('Rook');
      expect(board.getPiece(new Square('a1'))?.color).toBe('white');
      expect(board.getPiece(new Square('e1'))?.name).toBe('King');
      expect(board.getPiece(new Square('e1'))?.color).toBe('white');
      
      // Check black pieces
      expect(board.getPiece(new Square('a8'))?.name).toBe('Rook');
      expect(board.getPiece(new Square('a8'))?.color).toBe('black');
      expect(board.getPiece(new Square('e8'))?.name).toBe('King');
      expect(board.getPiece(new Square('e8'))?.color).toBe('black');
    });

    it('should have empty squares in the middle', () => {
      expect(board.getPiece(new Square('e4'))).toBeUndefined();
      expect(board.getPiece(new Square('d5'))).toBeUndefined();
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
      
      game.makeMove(new Square('e2'), new Square('e4'));
      expect(game.getCurrentPlayer()).toBe('black');
      
      game.makeMove(new Square('e7'), new Square('e5'));
      expect(game.getCurrentPlayer()).toBe('white');
    });
  });

  describe('Piece Movements', () => {
    it('should allow pawn to move forward one square', () => {
      game.makeMove(new Square('e2'), new Square('e3'));
      expect(game.getMoveHistory()).toHaveLength(1);
    });

    it('should allow pawn to move forward two squares from starting position', () => {
      game.makeMove(new Square('e2'), new Square('e4'));
      expect(game.getMoveHistory()).toHaveLength(1);
    });

    it('should allow knight to move in L-shape', () => {
      game.makeMove(new Square('g1'), new Square('f3'));
      expect(game.getMoveHistory()).toHaveLength(1);
    });

    it('should allow bishop to move diagonally', () => {
      game.makeMove(new Square('e2'), new Square('e4'));
      game.makeMove(new Square('e7'), new Square('e5'));
      
      game.makeMove(new Square('f1'), new Square('c4'));
      expect(game.getMoveHistory()).toHaveLength(3);
    });

    it('should allow rook to move horizontally and vertically', () => {
      game.makeMove(new Square('h2'), new Square('h4'));
      game.makeMove(new Square('e7'), new Square('e5'));
      
      game.makeMove(new Square('h1'), new Square('h3'));
      expect(game.getMoveHistory()).toHaveLength(3);
    });

    it('should allow queen to move diagonally', () => {
      game.makeMove(new Square('e2'), new Square('e4'));
      game.makeMove(new Square('e7'), new Square('e5'));
      
      game.makeMove(new Square('d1'), new Square('h5'));
      expect(game.getMoveHistory()).toHaveLength(3);
    });

    it('should allow queen to move horizontally', () => {
      game.makeMove(new Square('d2'), new Square('d4'));
      game.makeMove(new Square('e7'), new Square('e5'));
      
      game.makeMove(new Square('d1'), new Square('d3'));
      expect(game.getMoveHistory()).toHaveLength(3);
    });

    it('should reject invalid piece movements', () => {
      expect(() => {
        game.makeMove(new Square('e2'), new Square('e6')); // Pawn can't move 4 squares
      }).toThrow('Invalid move');
    });

    it('should reject moves from empty squares', () => {
      expect(() => {
        game.makeMove(new Square('e3'), new Square('e4'));
      }).toThrow('No piece at e3');
    });

    it('should reject moves to invalid squares', () => {
      expect(() => {
        game.makeMove(new Square('e2'), new Square('e9'));
      }).toThrow('Invalid square notation');
    });
  });

  describe('Captured Pieces', () => {
    it('should track captured pieces when capture occurs', () => {
      // Move white pawn
      game.makeMove(new Square('e2'), new Square('e4'));
      game.makeMove(new Square('e7'), new Square('e5'));
      
      // Move white pawn to d4 to prepare for capture
      game.makeMove(new Square('d2'), new Square('d4'));
      game.makeMove(new Square('d7'), new Square('d5'));
      
      // Capture black pawn (it's white's turn)
      game.makeMove(new Square('d4'), new Square('d5'));
      
      const moveHistory = game.getMoveHistory();
      const capturedMoves = moveHistory.filter(m => m.isCapture);
      expect(capturedMoves.length).toBe(1);
      expect(capturedMoves[0].capturedPiece?.name).toBe('Pawn');
      expect(capturedMoves[0].capturedPiece?.color).toBe('black');
    });

    it('should not track captured pieces when no capture occurs', () => {
      game.makeMove(new Square('e2'), new Square('e4'));
      game.makeMove(new Square('e7'), new Square('e5'));
      game.makeMove(new Square('g1'), new Square('f3'));

      const moveHistory = game.getMoveHistory();
      const capturedMoves = moveHistory.filter(m => m.isCapture);
      expect(capturedMoves.length).toBe(0);
    });
  });

  describe('Move History', () => {
    it('should start with empty move history', () => {
      expect(game.getMoveHistory()).toHaveLength(0);
    });

    it('should track moves correctly', () => {
      game.makeMove(new Square('e2'), new Square('e4'));
      game.makeMove(new Square('e7'), new Square('e5'));
      game.makeMove(new Square('g1'), new Square('f3'));
      game.makeMove(new Square('b8'), new Square('c6'));

      const moveHistory = game.getMoveHistory();
      expect(moveHistory).toHaveLength(4);

      // Check first move
      expect(moveHistory[0].from.notation).toBe('e2');
      expect(moveHistory[0].to.notation).toBe('e4');
      expect(moveHistory[0].piece.name).toBe('Pawn');
      expect(moveHistory[0].piece.color).toBe('white');

      // Check second move
      expect(moveHistory[1].from.notation).toBe('e7');
      expect(moveHistory[1].to.notation).toBe('e5');
      expect(moveHistory[1].piece.name).toBe('Pawn');
      expect(moveHistory[1].piece.color).toBe('black');

      // Check third move
      expect(moveHistory[2].from.notation).toBe('g1');
      expect(moveHistory[2].to.notation).toBe('f3');
      expect(moveHistory[2].piece.name).toBe('Knight');
      expect(moveHistory[2].piece.color).toBe('white');
    });

    it('should track capture moves correctly', () => {
      game.makeMove(new Square('e2'), new Square('e4'));
      game.makeMove(new Square('e7'), new Square('e5'));
      game.makeMove(new Square('d2'), new Square('d4'));
      game.makeMove(new Square('d7'), new Square('d5'));
      game.makeMove(new Square('d4'), new Square('d5')); // Capture (white's turn)

      const moveHistory = game.getMoveHistory();
      const captureMove = moveHistory[4];
      
      expect(captureMove.isCapture).toBe(true);
      expect(captureMove.piece.name).toBe('Pawn');
      expect(captureMove.piece.color).toBe('white');
    });
  });

  describe('Game State', () => {
    it('should maintain proper game state throughout play', () => {
      const initialState = game.getGameState();
      expect(initialState.currentPlayer).toBe('white');
      expect(initialState.isGameOver).toBe(false);
      expect(game.getMoveHistory()).toHaveLength(0);

      game.makeMove(new Square('e2'), new Square('e4'));
      const afterFirstMove = game.getGameState();
      expect(afterFirstMove.currentPlayer).toBe('black');
      expect(game.getMoveHistory()).toHaveLength(1);
    });

    it('should not be game over initially', () => {
      const gameState = game.getGameState();
      expect(gameState.isGameOver).toBe(false);
      expect(gameState.winner).toBeUndefined();
    });
  });

  describe('Board Updates', () => {
    it('should update board after moves', () => {
      game.makeMove(new Square('e2'), new Square('e4'));
      const boardString = game.getBoardString();
      
      // Check that the board shows the moved pawn
      expect(boardString).toContain('4 · · · · ♙ · · · 4'); // e4 has pawn
      expect(boardString).toContain('2 ♙ ♙ ♙ ♙ · ♙ ♙ ♙ 2'); // e2 is empty
    });
  });
});
