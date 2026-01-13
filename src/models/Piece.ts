import { Color } from '../types/chess';
import { Square } from '../utils/Square';
import { Board } from './Board';

export interface MoveDirection {
  file: number;
  rank: number;
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
      reachableSquares.push(...this.getReachableSquaresInDirection(this._square, direction));
    }

    return reachableSquares;
  }

  protected getReachableSquaresInDirection(startSquare: Square, direction: MoveDirection): Square[] {
    const nextSquare = startSquare.offset(direction.file, direction.rank);
    if (!nextSquare) return []; // outside board
    if (this.board.isOccupiedBy(nextSquare, this._color)) return []; // blocked by same color piece

    const reachableSquares = [nextSquare];
    if (this.board.isOccupiedByOpponent(nextSquare, this._color)) return reachableSquares; // capture and stop

    return reachableSquares;
  }

  /**
   * Example: "white pawn at e2"
   */
  toString(): string {
    return `${this.color} ${this.name} at ${this.square.notation}`;
  }
}

export abstract class SlidingPiece extends Piece {
  protected override getReachableSquaresInDirection(startSquare: Square, direction: MoveDirection): Square[] {
    const reachableSquares = super.getReachableSquaresInDirection(startSquare, direction);
    
    const nextSquare = reachableSquares[0];
    if (nextSquare && this.board.isEmpty(nextSquare)) {
      reachableSquares.push(...this.getReachableSquaresInDirection(nextSquare, direction));
    }
    
    return reachableSquares;
  }
}

