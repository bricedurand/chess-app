import { Color } from '../types/chess';
import { Square } from '../utils/Square';
import { Board } from './Board';

export interface MoveDirection {
  file: number;
  rank: number;
  maxSteps: number;
}

export abstract class Piece {
  public readonly _color: Color;
  private _square: Square;
  protected board: Board;

  constructor(color: Color, square: Square, board: Board) {
    this._color = color;
    this.board = board;
    this._square = square;
  }

  /**
   * Gets the symbol of the piece (e.g., "♙", "♚", "♛")
   */
  abstract get symbol(): string;

  /**
   * Gets the notation of the piece (e.g., "P", "K", "Q")
   */
  abstract get notation(): string;

  get color(): Color {
    return this._color;
  }

  isWhite(): boolean {
    return this._color === 'white';
  }
  
  isBlack(): boolean {
    return this._color === 'black';
  }

  get square(): Square {
    return this._square;
  }

  set square(newSquare: Square) {
    this._square = newSquare;
  }

  /**
   * Gets the name of the piece (e.g., "Pawn", "King", "Queen")
   */
  get name(): string {
    return this.constructor.name;
  }

  abstract getDirections(): MoveDirection[];

    /**
   * Gets all squares the piece can move to, without considering if king is in check
   * A square is reachable if it is inside the board and not occupied or blocked by a piece with the same color
   * @returns Array of squares the piece can reach
   */
  getReachableSquares(): Square[] {
    const reachableSquares: Square[] = [];
    const directions = this.getDirections();

    for (const direction of directions) {
      let currentSquare = this._square;
      let steps = 1;

      while (steps <= direction.maxSteps) {
        const nextSquare = currentSquare.offset(direction.file, direction.rank);
        if (!nextSquare) break; // Out of bounds

        // Stop if occupied by own piece
        if (this.board.isOccupiedBy(nextSquare, this._color)) {
          break;
        }

        // Can capture opponent piece but stop afterwards
        if (this.board.isOccupiedByOpponent(nextSquare, this._color)) {
          reachableSquares.push(nextSquare);
          break;
        }

        reachableSquares.push(nextSquare);
        currentSquare = nextSquare;
        steps++;
      }
    }

    return reachableSquares;
  }

  /**
   * Example: "white pawn at e2"
   */
  toString(): string {
    return `${this.color} ${this.name} at ${this.square.notation}`;
  }
}

