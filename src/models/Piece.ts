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
   * Determines if the piece can move to the target square
   * @param targetSquare - The square to move the pieceto
   * @returns True if the piece can move to the target square, false otherwise
   */
  abstract canMoveTo(targetSquare: SquareNotation): boolean;

  /**
   * Gets all possible moves this piece can make from its current position
   * @returns Array of Move objects representing all possible moves
   */
  getPossibleMoves(): Move[] {
    const theoreticalSquares = this.getTheoreticalSquares();
    return this.applyBoardConstraints(theoreticalSquares);
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
   * Gets theoretical squares this piece can reach based on its movement pattern
   * This is the first step - pure movement logic without board constraints
   * @returns Array of squares the piece can theoretically move to
   */
  protected abstract getTheoreticalSquares(): SquareNotation[];

  /**
   * Applies board constraints to theoretical squares and creates Move objects
   * @param theoreticalSquares - Array of squares from getTheoreticalSquares()
   * @returns Array of valid Move objects
   */
  protected applyBoardConstraints(theoreticalSquares: SquareNotation[]): Move[] {
    const possibleMoves: Move[] = [];

    for (const square of theoreticalSquares) {
      // Skip if square is occupied by own piece (obstruction)
      if (this.board.isOccupiedBy(square, this.color)) {
        continue;
      }

      // Check if square is occupied by opponent (capture)
      const isCapture = this.board.isOccupied(square);
      const capturedPiece = isCapture ? this.board.getPiece(square) : undefined;

      const move = new Move(this.square, square, this.board, 0, {
        isCapture,
        capturedPiece
      });

      possibleMoves.push(move);
    }

    return possibleMoves;
  }

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

      // Keep moving in this direction until we hit board edge, max distance, or obstruction
      while (file >= 1 && file <= 8 && rank >= 1 && rank <= 8 && distance <= maxDistance) {
        const square = SquareUtil.fromCoordinates({ file, rank });
        theoreticalSquares.push(square);
        
        // If this square is occupied, stop exploring this direction (obstruction blocks path)
        if (this.board.isOccupied(square)) {
          break;
        }
        
        // Move to next square in this direction
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

