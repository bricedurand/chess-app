import { SquareNotation, SquareCoordinates, SquareDistance } from '../types/chess';

export class Square {
  private static readonly FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  private static readonly RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

  private _notation: SquareNotation;
  private _coordinates: SquareCoordinates;

  constructor(input: SquareNotation | SquareCoordinates) {
    if (typeof input === 'string') {
      this._notation = input;
      this._coordinates = Square.toCoordinates(input);
    } else {
      this._coordinates = input;
      this._notation = Square.fromCoordinates(input);
    }
  }

  get notation(): SquareNotation {
    return this._notation;
  }

  get coordinates(): SquareCoordinates {
    return { ...this._coordinates };
  }

  get file(): number {
    return this._coordinates.file;
  }

  get rank(): number {
    return this._coordinates.rank;
  }

  /**
   * Creates a square offset from this one
   */
  offset(fileOffset: number, rankOffset: number): Square | null {
    const newFile = this.file + fileOffset;
    const newRank = this.rank + rankOffset;

    if (!Square.isValid({ file: newFile, rank: newRank })) {
      return null;
    }

    return new Square({ file: newFile, rank: newRank });
  }

  /**
   * Gets the distance to another square
   */
  distanceTo(other: Square): SquareDistance {
    return {
      fileDistance: Math.abs(this.file - other.file),
      rankDistance: Math.abs(this.rank - other.rank)
    };
  }

  /**
   * Checks if this square is on the same diagonal as another
   */
  isSameDiagonal(other: Square): boolean {
    const distance = this.distanceTo(other);
    return distance.fileDistance === distance.rankDistance && distance.fileDistance > 0;
  }

  /**
   * Checks if this square is on the same file as another
   */
  isSameFile(other: Square): boolean {
    return this.file === other.file;
  }

  /**
   * Checks if this square is on the same rank as another
   */
  isSameRank(other: Square): boolean {
    return this.rank === other.rank;
  }

  /**
   * Checks if this square is equal to another (same position)
   */
  equals(other: Square): boolean {
    return this.file === other.file && this.rank === other.rank;
  }

  /**
   * Validates if a square notation is valid (e.g., "e5", "a1")
   */
  static isValid(square: SquareNotation): boolean;
  static isValid(square: SquareCoordinates): boolean;
  static isValid(square: SquareNotation | SquareCoordinates): boolean {
    if (typeof square === 'string') {
      if (square.length !== 2) return false;
      
      const file = square[0];
      const rank = square[1];

      return this.FILES.includes(file) && this.RANKS.includes(rank);
    } else {
      return square.file >= 1 && square.file <= 8 && square.rank >= 1 && square.rank <= 8;
    }
  }

  /**
   * Converts square notation to numeric coordinates
   */
  static toCoordinates(square: SquareNotation): SquareCoordinates {
    if (!this.isValid(square)) {
      throw new Error(`Invalid square notation: ${square}`);
    }

    const file = square[0];
    const rank = square[1];

    return {
      file: this.FILES.indexOf(file) + 1,
      rank: parseInt(rank)
    };
  }

  /**
   * Converts numeric coordinates to square notation
   */
  static fromCoordinates(coordinates: SquareCoordinates): SquareNotation {
    if (coordinates.file < 1 || coordinates.file > 8 || coordinates.rank < 1 || coordinates.rank > 8) {
      throw new Error(`Invalid coordinates: file=${coordinates.file}, rank=${coordinates.rank}`);
    }

    const fileChar = this.FILES[coordinates.file - 1];
    const rankChar = this.RANKS[coordinates.rank - 1];
    
    return fileChar + rankChar;
  }

  /**
   * Gets all squares on the board
   */
  static getAllSquares(): Square[] {
    const squares: Square[] = [];
    for (let file of this.FILES) {
      for (let rank of this.RANKS) {
        squares.push(new Square(file + rank));
      }
    }
    return squares;
  }
}
