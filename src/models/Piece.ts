import { Color, SquareNotation } from '../types/chess';
import { Square as SquareUtil } from '../utils/Square';
import { Board } from './Board';
import { Move } from './Move';

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
   * Gets all squares the piece can move to, without considering if king is in check
   * A square is reachable if it is inside the board and not occupied or blocked by a piece with the same color
   * @returns Array of squares the piece can reach
   */
  abstract getReachableSquares(): SquareNotation[];

  /**
   * Helper method for sliding pieces (Rook, Bishop, Queen)
   * Generates theoretical squares by exploring in given directions, stopping at obstructions
   * @param directions - Array of direction vectors {file, rank}
   * @param maxDistance - Maximum distance to explore (default: 7 for unlimited)
   * @returns Array of theoretical squares
   */
  protected getSlidingSquares(directions: Array<{file: number, rank: number}>, maxDistance: number = 7): SquareNotation[] {
    const theoreticalSquares: SquareNotation[] = [];
    const currentCoords = SquareUtil.toCoordinates(this.square);

    for (const direction of directions) {
      let file = currentCoords.file + direction.file;
      let rank = currentCoords.rank + direction.rank;
      let distance = 1;

      while (file >= 1 && file <= 8 && rank >= 1 && rank <= 8 && distance <= maxDistance) {
        const sq = SquareUtil.fromCoordinates({ file, rank });
        theoreticalSquares.push(sq);
        if (this.board.isOccupied(sq)) break;
        file += direction.file;
        rank += direction.rank;
        distance++;
      }
    }

    return theoreticalSquares;
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

