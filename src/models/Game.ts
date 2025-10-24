import { Color, GameState, SquareNotation, Move } from '../types/chess';
import { Board } from './Board';
import { Piece } from './Piece';
import { Square as SquareUtil } from '../utils/Square';

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

    if (!SquareUtil.isValid(from) || !SquareUtil.isValid(to)) {
      throw new Error('Invalid square notation');
    }

    const piece = this.board.getPiece(from);
    if (!piece) {
      throw new Error(`No piece at ${from}`);
    }

    if (piece.color !== this.currentPlayer) {
      throw new Error(`It's ${this.currentPlayer}'s turn`);
    }

    if (!piece.canMoveTo(to)) {
      throw new Error(`Invalid move: ${piece.type} cannot move from ${from} to ${to}`);
    }

    // Check if the move would put own king in check
    if (this.wouldMovePutKingInCheck(from, to)) {
      throw new Error('Move would put own king in check');
    }

    // Make the move
    const capturedPiece = this.board.movePiece(from, to);
    const moveNumber = Math.floor(this.moveHistory.length / 2) + 1;
    
    // Create move record
    const move = new Move(from, to, piece, moveNumber, {
      isCapture: !!capturedPiece,
      isCheck: this.isKingInCheck(this.getOpponentColor()),
      isCheckmate: this.isCheckmate(this.getOpponentColor())
    });

    this.moveHistory.push(move);

    // Check for game over conditions
    this.checkGameOver();

    // Switch players
    this.currentPlayer = this.getOpponentColor();

    return true;
  }

  /**
   * Checks if a move would put the current player's king in check
   */
  private wouldMovePutKingInCheck(from: SquareNotation, to: SquareNotation): boolean {
    // Create a temporary board to test the move
    const tempBoard = this.board.clone();
    tempBoard.movePiece(from, to);
    
    // Check if the king is in check after the move
    return tempBoard.isKingInCheck(this.currentPlayer);
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
      const possibleMoves = this.getPossibleMoves(piece);
      for (const move of possibleMoves) {
        if (!this.wouldMovePutKingInCheck(piece.square, move)) {
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
      const possibleMoves = this.getPossibleMoves(piece);
      for (const move of possibleMoves) {
        if (!this.wouldMovePutKingInCheck(piece.square, move)) {
          return false; // Found a legal move
        }
      }
    }

    return true;
  }

  /**
   * Gets possible moves for a piece (simplified)
   */
  private getPossibleMoves(piece: Piece): string[] {
    const possibleMoves: string[] = [];
    const allSquares = SquareUtil.getAllSquares();

    for (const square of allSquares) {
      if (square !== piece.square && piece.canMoveTo(square)) {
        possibleMoves.push(square);
      }
    }

    return possibleMoves;
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
    if (lastMove.isCapture) {
      const capturedPiece = this.board.getCapturedPieces().pop();
      if (capturedPiece) {
        this.board.placePiece(capturedPiece, lastMove.to);
      }
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

