import { Color, SquareNotation } from '../types/chess';
import { Board } from './Board';
import { Piece } from './Piece';
import { Move } from './Move';
import { Square as SquareUtil } from '../utils/Square';

export interface GameState {
  currentPlayer: Color;
  moveHistory: Move[];
  capturedPieces: Piece[];
  isGameOver: boolean;
  winner?: Color;
  gameResult?: 'checkmate' | 'stalemate' | 'draw';
}

export class Game {
  private board: Board;
  private currentPlayer: Color = 'white';
  private moveHistory: Move[] = [];
  private isGameOver: boolean = false;
  private winner?: Color;
  private gameResult?: 'checkmate' | 'stalemate' | 'draw';

  constructor() {
    this.board = new Board();
  }

  getGameState(): GameState {
    return {
      currentPlayer: this.currentPlayer,
      moveHistory: [...this.moveHistory],
      capturedPieces: this.board.getCapturedPieces(),
      isGameOver: this.isGameOver,
      winner: this.winner,
      gameResult: this.gameResult
    };
  }

  getBoard(): Board {
    return this.board;
  }

  /**
   * Gets the current player
   */
  getCurrentPlayer(): Color {
    return this.currentPlayer;
  }

  /**
   * Gets the move history
   */
  getMoveHistory(): Move[] {
    return [...this.moveHistory];
  }

  /**
   * Attempts to make a move
   */
  makeMove(from: SquareNotation, to: SquareNotation): boolean {
    if (this.isGameOver) {
      throw new Error('Game is over');
    }

    // Create candidate move
    const candidateMove = new Move(from, to, this.board);

    // Validate the move
    const validatedMove = candidateMove.validate(this.currentPlayer);

    if (!validatedMove.isValid) {
      throw new Error(`Invalid move: ${validatedMove.validationErrors.join(', ')}`);
    }

    // Execute the move
    validatedMove.execute();
    const moveNumber = Math.floor(this.moveHistory.length / 2) + 1;
    
    // Create historical move record
    const historicalMove = validatedMove.toHistoricalMove(moveNumber);
    this.moveHistory.push(historicalMove);

    // Check for game over conditions
    this.checkGameOver();

    // Switch players
    this.currentPlayer = this.getOpponentColor();

    return true;
  }


  /**
   * Checks if the king of the specified color is in check
   */
  private isKingInCheck(color: Color): boolean {
    return this.board.isKingInCheck(color);
  }

  /**
   * Checks if the specified color is in checkmate
   */
  private isCheckmate(color: Color): boolean {
    if (!this.isKingInCheck(color)) return false;

    // Check if there are any legal moves
    const pieces = this.board.getPiecesByColor(color);
    for (const piece of pieces) {
      const possibleSquares = this.getPossibleSquares(piece);
      for (const square of possibleSquares) {
        const candidateMove = new Move(piece.square, square, this.board);
        const validatedMove = candidateMove.validate(color);
        if (validatedMove.isValid) {
          return false; // Found a legal move
        }
      }
    }

    return true;
  }

  /**
   * Checks if the specified color is in stalemate
   */
  private isStalemate(color: Color): boolean {
    if (this.isKingInCheck(color)) return false;

    // Check if there are any legal moves
    const pieces = this.board.getPiecesByColor(color);
    for (const piece of pieces) {
      const possibleSquares = this.getPossibleSquares(piece);
      for (const square of possibleSquares) {
        const candidateMove = new Move(piece.square, square, this.board);
        const validatedMove = candidateMove.validate(color);
        if (validatedMove.isValid) {
          return false; // Found a legal move
        }
      }
    }

    return true;
  }

  /**
   * Gets possible squares a piece can move to. Brute force method.
   */
  private getPossibleSquares(piece: Piece): SquareNotation[] {
    const possibleSquares: SquareNotation[] = [];
    const allSquares = SquareUtil.getAllSquares();

    for (const square of allSquares) {
      if (square !== piece.square && piece.canMoveTo(square)) {
        possibleSquares.push(square);
      }
    }

    return possibleSquares;
  }

  /**
   * Checks for game over conditions
   */
  private checkGameOver(): void {
    const opponentColor = this.getOpponentColor();

    if (this.isCheckmate(opponentColor)) {
      this.isGameOver = true;
      this.winner = this.currentPlayer;
      this.gameResult = 'checkmate';
    } else if (this.isStalemate(opponentColor)) {
      this.isGameOver = true;
      this.gameResult = 'stalemate';
    }
  }

  /**
   * Gets the opponent color
   */
  private getOpponentColor(): Color {
    return this.currentPlayer === 'white' ? 'black' : 'white';
  }

  /**
   * Undoes the last move
   */
  undoMove(): boolean {
    if (this.moveHistory.length === 0) {
      return false;
    }

    const lastMove = this.moveHistory.pop()!;
    
    // Move piece back
    this.board.movePiece(lastMove.to, lastMove.from);
    
    // Restore captured piece if any
    if (lastMove.isCapture && lastMove.capturedPiece) {
      this.board.placePiece(lastMove.capturedPiece, lastMove.to);
    }

    // Switch players back
    this.currentPlayer = this.getOpponentColor();
    
    // Reset game over state
    this.isGameOver = false;
    this.winner = undefined;
    this.gameResult = undefined;

    return true;
  }

  /**
   * Resets the game to initial state
   */
  reset(): void {
    this.board = new Board();
    this.currentPlayer = 'white';
    this.moveHistory = [];
    this.isGameOver = false;
    this.winner = undefined;
    this.gameResult = undefined;
  }

  /**
   * Gets the current board as a string
   */
  getBoardString(): string {
    return this.board.toString();
  }

  /**
   * Gets the move history as a string
   */
  getMoveHistoryString(): string {
    return this.moveHistory.map(move => move.toString()).join('\n');
  }
}

