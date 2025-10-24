import { SquareNotation, SquareCoordinates, SquareDistance } from '../types/chess';

export class Square {
  private static readonly FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  private static readonly RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

  /**
   * Validates if a square notation is valid (e.g., "e5", "a1")
   */
  static isValid(square: SquareNotation): boolean {
    if (square.length !== 2) return false;
    
    const file = square[0];
    const rank = square[1];
    
    return this.FILES.includes(file) && this.RANKS.includes(rank);
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
   * Gets the distance between two squares
   */
  static getDistance(from: SquareNotation, to: SquareNotation): SquareDistance {
    const fromCoords = this.toCoordinates(from);
    const toCoords = this.toCoordinates(to);

    return {
      fileDistance: Math.abs(toCoords.file - fromCoords.file),
      rankDistance: Math.abs(toCoords.rank - fromCoords.rank)
    };
  }

  /**
   * Checks if two squares are on the same diagonal
   */
  static isSameDiagonal(square1: SquareNotation, square2: SquareNotation): boolean {
    const distance = this.getDistance(square1, square2);
    return distance.fileDistance === distance.rankDistance && distance.fileDistance > 0;
  }

  /**
   * Checks if two squares are on the same file (column)
   */
  static isSameFile(square1: SquareNotation, square2: SquareNotation): boolean {
    return square1[0] === square2[0];
  }

  /**
   * Checks if two squares are on the same rank (row)
   */
  static isSameRank(square1: SquareNotation, square2: SquareNotation): boolean {
    return square1[1] === square2[1];
  }

  /**
   * Gets all squares on the board
   */
  static getAllSquares(): SquareNotation[] {
    const squares: SquareNotation[] = [];
    for (let file of this.FILES) {
      for (let rank of this.RANKS) {
        squares.push(file + rank);
      }
    }
    return squares;
  }
}

