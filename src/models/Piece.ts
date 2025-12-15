import { Color, SquareNotation } from '../types/chess';
import { Square as SquareUtil } from '../utils/Square';
import { Board } from './Board';

export abstract class Piece {
  public readonly _color: Color;
  private _square!: SquareNotation;
  protected _hasMoved: boolean = false;
  protected board: Board;

  constructor(color: Color, square: SquareNotation, board: Board) {
    this._color = color;
    this.board = board;
    this.square = square;
  }

  /**
   * Gets all squares the piece can move to, without considering if king is in check
   * A square is reachable if it is inside the board and not occupied or blocked by a piece with the same color
   * @returns Array of squares the piece can reach
   */
  abstract getReachableSquares(): SquareNotation[];

  /**
   * Gets the symbol of the piece (e.g., "♙", "♚", "♛")
   */
  abstract get symbol(): string;

  /**
   * Gets the notation of the piece (e.g., "P", "K", "Q")
   */
  abstract get notation(): string;

  get color(): Color {
    return this.color;
  }

  get square(): SquareNotation {
    return this._square;
  }

  set square(newSquare: SquareNotation) {
    if (!SquareUtil.isValid(newSquare)) {
      throw new Error(`Invalid square: ${newSquare}`);
    }
    this._square = newSquare;
    this._hasMoved = true;
  }

  get hasMoved(): boolean {
    return this._hasMoved;
  }

  /**
   * Gets the name of the piece (e.g., "Pawn", "King", "Queen")
   */
  get name(): string {
    return (this.constructor as any).name;
  }

  /**
   * Example: "white pawn at e2"
   */
  toString(): string {
    return `${this.color} ${this.name} at ${this.square}`;
  }
}

