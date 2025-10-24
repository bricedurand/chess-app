import { Color, SquareNotation, SquareDistance } from '../types/chess';
import { Square as SquareUtil } from '../utils/Square';

export abstract class Piece {
  public readonly color: Color;
  private _square!: SquareNotation;
  protected _hasMoved: boolean = false;

  constructor(color: Color, square: SquareNotation) {
    this.color = color;
    this.square = square;
  }

  // Abstract method that must be implemented by subclasses
  abstract canMoveTo(targetSquare: SquareNotation): boolean;
  
  // Abstract method for cloning pieces
  abstract clone(): Piece;

  /**
   * Helper method to copy common properties to a cloned piece
   */
  protected copyToClone(clonedPiece: Piece): void {
    if (this._hasMoved) {
      clonedPiece._hasMoved = true;
    }
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

  // These methods are now abstract and must be implemented by subclasses
  abstract get symbol(): string;
  abstract get notation(): string;

  /**
   * Gets the name of the piece (e.g., "pawn", "king", "queen")
   */
  get name(): string {
    return this.constructor.name.toLowerCase();
  }

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

  /**
   * Helper method to get distance between squares
   */
  protected getDistance(targetSquare: SquareNotation): SquareDistance {
    return SquareUtil.getDistance(this.square, targetSquare);
  }

  /**
   * Returns a string representation of the piece
   */
  toString(): string {
    return `${this.color} ${this.name} at ${this.square}`;
  }
}

