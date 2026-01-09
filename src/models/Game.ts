import { Color } from '../types/chess';
import { Board } from './Board';
import { Move } from './Move';
import { Square } from '../utils/Square';

export interface GameState {
  currentPlayer: Color;
  moveHistory: Move[];
  isGameOver: boolean;
  winner?: Color;
  gameResult?: 'checkmate' | 'stalemate';
}

export class Game {
  private board: Board;
  private currentPlayer: Color = 'white';
  private moveHistory: Move[] = [];
  private isGameOver: boolean = false;
  private winner?: Color;
  private gameResult?: 'checkmate' | 'stalemate';

  constructor() {
    this.board = new Board();
  }

  getGameState(): GameState {
    return {
      currentPlayer: this.currentPlayer,
      moveHistory: [...this.moveHistory],
      isGameOver: this.isGameOver,
      winner: this.winner,
      gameResult: this.gameResult
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
      throw new Error(`No piece at ${from}`);
    }
    if (piece.color !== this.currentPlayer) {
      throw new Error(`It's ${this.currentPlayer}'s turn`);
    }

    const legalMoves = this.board.getLegalMoves(piece);
    const isLegal = legalMoves.some(move => move.to.equals(to));
    if (!isLegal) {
      throw new Error(`Invalid move: ${piece.name} cannot move from ${from} to ${to}`);
    }

    const move = new Move(from, to, this.board);
    this.board.executeMove(move);

    const opponentColor = this.getOpponentColor();
    const state = this.evaluateGameState(opponentColor);
    
    const moveNumber = Math.floor(this.moveHistory.length / 2) + 1;
    const historicalMove = move.toHistoricalMove(moveNumber, state.isCheck, state.isCheckmate);
    this.moveHistory.push(historicalMove);

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

  private evaluateGameState(color: Color): { isCheck: boolean; isCheckmate: boolean; isStalemate: boolean } {
    const isCheck = this.board.isKingInCheck(color);
    const hasLegalMoves = this.hasLegalMoves(color);
    const isCheckmate = isCheck && !hasLegalMoves;
    const isStalemate = !isCheck && !hasLegalMoves;

    if (isCheckmate) {
      this.isGameOver = true;
      this.winner = this.currentPlayer;
      this.gameResult = 'checkmate';
    } else if (isStalemate) {
      this.isGameOver = true;
      this.winner = undefined;
      this.gameResult = 'stalemate';
    } else {
      this.isGameOver = false;
      this.winner = undefined;
      this.gameResult = undefined;
    }

    return { isCheck, isCheckmate, isStalemate };
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

