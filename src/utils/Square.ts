export class Square {
  private static readonly FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  private static readonly RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

  /**
   * Validates if a square notation is valid (e.g., "e5", "a1")
   */
  static isValid(square: string): boolean {
    if (square.length !== 2) return false;
    
    const file = square[0];
    const rank = square[1];
    
    return this.FILES.includes(file) && this.RANKS.includes(rank);
  }

  /**
   * Converts square notation to numeric coordinates
   */
  static toCoordinates(square: string): { col: number; row: number } {
    if (!this.isValid(square)) {
      throw new Error(`Invalid square notation: ${square}`);
    }

    const file = square[0];
    const rank = square[1];

    return {
      col: this.FILES.indexOf(file) + 1,
      row: parseInt(rank)
    };
  }

  /**
   * Converts numeric coordinates to square notation
   */
  static fromCoordinates(col: number, row: number): string {
    if (col < 1 || col > 8 || row < 1 || row > 8) {
      throw new Error(`Invalid coordinates: col=${col}, row=${row}`);
    }

    const file = this.FILES[col - 1];
    const rank = this.RANKS[row - 1];
    
    return file + rank;
  }

  /**
   * Gets the distance between two squares
   */
  static getDistance(from: string, to: string): { fileDistance: number; rankDistance: number } {
    const fromCoords = this.toCoordinates(from);
    const toCoords = this.toCoordinates(to);

    return {
      fileDistance: Math.abs(toCoords.col - fromCoords.col),
      rankDistance: Math.abs(toCoords.row - fromCoords.row)
    };
  }

  /**
   * Checks if two squares are on the same diagonal
   */
  static isSameDiagonal(square1: string, square2: string): boolean {
    const distance = this.getDistance(square1, square2);
    return distance.fileDistance === distance.rankDistance && distance.fileDistance > 0;
  }

  /**
   * Checks if two squares are on the same file (column)
   */
  static isSameFile(square1: string, square2: string): boolean {
    return square1[0] === square2[0];
  }

  /**
   * Checks if two squares are on the same rank (row)
   */
  static isSameRank(square1: string, square2: string): boolean {
    return square1[1] === square2[1];
  }

  /**
   * Gets all squares on the board
   */
  static getAllSquares(): string[] {
    const squares: string[] = [];
    for (let file of this.FILES) {
      for (let rank of this.RANKS) {
        squares.push(file + rank);
      }
    }
    return squares;
  }
}

