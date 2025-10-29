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

  /**
   * Helper method for sliding pieces (Rook, Bishop, Queen)
   * Explores squares in a given direction until hitting a piece or board edge
   * @param directions - Array of direction vectors {file, rank}
   * @returns Array of reachable squares
   */
  protected getSlidingMoves(directions: Array<{file: number, rank: number}>): SquareNotation[] {
    const reachableSquares: SquareNotation[] = [];
    const currentCoords = SquareUtil.toCoordinates(this.square);

    for (const direction of directions) {
      let file = currentCoords.file + direction.file;
      let rank = currentCoords.rank + direction.rank;

      // Keep moving in this direction until we hit a piece or board edge
      while (file >= 1 && file <= 8 && rank >= 1 && rank <= 8) {
        const square = SquareUtil.fromCoordinates({ file, rank });
        
        // If square is occupied by own piece, stop
        if (this.board.isOccupiedBy(square, this.color)) {
          break;
        }
        
        // If square is occupied by opponent piece, we can capture it
        if (this.board.isOccupied(square)) {
          reachableSquares.push(square);
          break;
        }
        
        // Empty square, we can move here
        reachableSquares.push(square);
        
        // Move to next square in this direction
        file += direction.file;
        rank += direction.rank;
      }
    }

    return reachableSquares;
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

