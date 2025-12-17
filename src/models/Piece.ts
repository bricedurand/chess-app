import { Color, SquareNotation, SquareCoordinates } from '../types/chess';
import { Square } from '../utils/Square';
import { Board } from './Board';

export interface MoveDirection {
  file: number;
  rank: number;
  
  // speacial rules for pawns
  canCapture?: boolean; // pawns can only capture diagonally
  maxSteps?: number; // pawns can move 2 steps from starting position
}

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
    if (!Square.isValid(newSquare)) {
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

  abstract getDirections(): MoveDirection[];

  abstract getMaxSteps(): number;

    /**
   * Gets all squares the piece can move to, without considering if king is in check
   * A square is reachable if it is inside the board and not occupied or blocked by a piece with the same color
   * @returns Array of squares the piece can reach
   */
  getReachableSquares(): SquareNotation[] {
    const reachableSquares: SquareNotation[] = [];
    const currentCoords = Square.toCoordinates(this.square);
    const directions = this.getDirections();

    for (const direction of directions) {
      const candidateSquareCoordinates: SquareCoordinates = { file: currentCoords.file + direction.file, rank: currentCoords.rank + direction.rank };
      const candidateSquare = Square.fromCoordinates(candidateSquareCoordinates);

      let steps = 1;
      let maxSteps = direction.maxSteps ?? this.getMaxSteps();
      while (steps <= maxSteps &&
             Square.isValid(candidateSquare)) {

        // Stop if occupied by own piece
        if (this.board.isOccupiedBy(candidateSquare, this.color)) {
          break;
        }

        reachableSquares.push(candidateSquare);

        // Can capture opponent piece but stop afterwards
        if (direction.canCapture !== false &&
            this.board.isOccupiedByOpponent(candidateSquare, this.color)) {
          break;
        }

        steps++;
      }
    }

    return reachableSquares;
  }


  /**
   * Example: "white pawn at e2"
   */
  toString(): string {
    return `${this.color} ${this.name} at ${this.square}`;
  }
}

