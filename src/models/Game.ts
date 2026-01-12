import { Color } from '../types/chess';
import { Board } from './Board';
import { Move } from './Move';
import { Square } from '../utils/Square';

export interface GameState {
  currentPlayer: Color;
  isGameOver: boolean;
  winner?: Color;
  isCheckmate: boolean;
  isStalemate: boolean;
  isCheck: boolean;
}

export class Game {
  private board: Board;
  private currentPlayer: Color = 'white';
  private moveHistory: Move[] = [];
  private isGameOver: boolean = false;
  private winner?: Color;
  private isCheckmate: boolean = false;
  private isStalemate: boolean = false;

  constructor() {
    this.board = new Board();
  }

  getGameState(): GameState {
    return {
      currentPlayer: this.currentPlayer,
      isGameOver: this.isGameOver,
      winner: this.winner,
      isCheckmate: this.isCheckmate,
      isStalemate: this.isStalemate,
      isCheck: this.board.isKingInCheck(this.currentPlayer)
    };
  }

  getBoard(): Board {
    return this.board;
  }

  getCurrentPlayer(): Color {
    return this.currentPlayer;
  }

  getMoveHistory(): Move[] {
    return [...this.moveHistory];
  }

  /**
   * Gets legal moves for a piece at the given square
   */
  getLegalMovesForSquare(square: Square): Move[] {
    const piece = this.board.getPiece(square);
    if (!piece || piece.color !== this.currentPlayer) {
      return [];
    }
    return this.board.getLegalMoves(piece);
  }

  /**
   * Attempts to make a move
   */
  makeMove(from: Square, to: Square): void {
    if (this.isGameOver) {
      throw new Error('Game is over');
    }

    const piece = this.board.getPiece(from);
    if (!piece) {
      throw new Error(`No piece at ${from.notation}`);
    }
    if (piece.color !== this.currentPlayer) {
      throw new Error(`It's ${this.currentPlayer}'s turn`);
    }

    const move = new Move(from, to, this.board);
    const isLegalMove = this.board.getLegalMoves(piece).some((legalMove) => legalMove.equals(move));
    if (!isLegalMove) {
      throw new Error(`Invalid move: ${piece.name} cannot move from ${from.notation} to ${to.notation}`);
    }

    this.board.executeMove(move);

    const opponentColor = this.getOpponentColor();
    const state = this.evaluateGameState(opponentColor);
    
    const moveNumber = Math.floor(this.moveHistory.length / 2) + 1;
    move.moveNumber = moveNumber;
    move.isCheck = state.isCheck;
    move.isCheckmate = state.isCheckmate;
    this.moveHistory.push(move);

    if (!this.isGameOver) {
      this.switchPlayers();
    }
  }


  private switchPlayers() {
    this.currentPlayer = this.getOpponentColor();
  }

  private hasLegalMoves(color: Color): boolean {
    const pieces = this.board.getPiecesByColor(color);
    for (const piece of pieces) {
      const legalMoves = this.board.getLegalMoves(piece);
      if (legalMoves.length > 0) {
        return true;
      }
    }
    return false; // No legal moves found
  }

  private evaluateGameState(color: Color): GameState {
    const isCheck = this.board.isKingInCheck(color);
    const hasLegalMoves = this.hasLegalMoves(color);
    this.isCheckmate = isCheck && !hasLegalMoves;
    this.isStalemate = !isCheck && !hasLegalMoves;

    this.isGameOver = this.isCheckmate || this.isStalemate;
    if (this.isCheckmate) {
      this.winner = this.currentPlayer;
    } else {
      this.winner = undefined;
    }

    return {
      currentPlayer: color,
      isGameOver: this.isGameOver,
      winner: this.winner,
      isCheckmate: this.isCheckmate,
      isStalemate: this.isStalemate,
      isCheck
    };
  }

  private getOpponentColor(): Color {
    return this.currentPlayer === 'white' ? 'black' : 'white';
  }

  undoMove(): boolean {
    if (this.moveHistory.length === 0) {
      return false;
    }

    const lastMove = this.moveHistory.pop()!;
    
    // Move piece back
    this.board.undoMove(lastMove);

    // Switch players back
    this.switchPlayers();
    
    // Reset game over state
    this.isGameOver = false;
    this.winner = undefined;
    this.isCheckmate = false;
    this.isStalemate = false;

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
    this.isCheckmate = false;
    this.isStalemate = false;
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

