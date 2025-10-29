import { Color, SquareNotation } from '../types/chess';
import { Square as SquareUtil } from '../utils/Square';
import { Board } from './Board';

export abstract class Piece {
  public readonly color: Color;
  private _square!: SquareNotation;
  protected _hasMoved: boolean = false;
  protected board: Board;

  constructor(color: Color, square: SquareNotation, board: Board) {
    this.color = color;
    this.board = board;
    this.square = square;
  }

  /**
   * Determines if the piece can move to the target square
   * @param targetSquare - The square to move the pieceto
   * @returns True if the piece can move to the target square, false otherwise
   */
  abstract canMoveTo(targetSquare: SquareNotation): boolean;

  /**
   * Gets all squares this piece can reach from its current position
   * @returns Array of squares the piece can move to
   */
  abstract getReachableSquares(): SquareNotation[];

  /**
   * Helper method to check if a target square is valid
   */
  protected isValidTarget(targetSquare: SquareNotation): boolean {
    if (!SquareUtil.isValid(targetSquare)) {
      return false;
    }

    // Can't move to the same square
    if (this.square === targetSquare) {
      return false;
    }

    return true;
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
   * Gets the symbol of the piece (e.g., "♙", "♚", "♛")
   */
  abstract get symbol(): string;

  /**
   * Gets the notation of the piece (e.g., "P", "K", "Q")
   */
  abstract get notation(): string;

  /**
   * Gets the name of the piece (e.g., "pawn", "king", "queen")
   */
  get name(): string {
    return this.constructor.name.toLowerCase();
  }

  /**
   * Example: "white pawn at e2"
   */
  toString(): string {
    return `${this.color} ${this.name} at ${this.square}`;
  }
}

