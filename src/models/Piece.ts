import { PieceType, Color, SquareNotation, SquareDistance } from '../types/chess';
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
  
  // Abstract getter for piece type
  abstract get type(): PieceType;
  
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

  /**
   * Gets the Unicode symbol for this piece
   */
  get symbol(): string {
    const symbols = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };

    return symbols[this.color][this.type];
  }

  /**
   * Gets the algebraic notation symbol for this piece
   */
  get notation(): string {
    const notationMap = {
      king: 'K',
      queen: 'Q',
      rook: 'R',
      bishop: 'B',
      knight: 'N',
      pawn: '' // Pawns don't have a symbol in notation
    };

    return notationMap[this.type];
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
    return `${this.color} ${this.type} at ${this.square}`;
  }
}

