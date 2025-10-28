import { SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Rook extends Piece {

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    const distance = SquareUtil.getDistance(this.square, targetSquare);
    
    // Rook moves horizontally or vertically
    return (distance.fileDistance === 0 && distance.rankDistance > 0) ||
           (distance.rankDistance === 0 && distance.fileDistance > 0);
  }

  getPath(from: SquareNotation, to: SquareNotation): SquareNotation[] {
    if (!this.isValidTarget(to)) {
      return [];
    }

    const fromCoords = SquareUtil.toCoordinates(from);
    const toCoords = SquareUtil.toCoordinates(to);
    
    // Rook moves horizontally or vertically
    if (fromCoords.file === toCoords.file) {
      // Vertical movement
      return this.getVerticalPath(from, to);
    } else if (fromCoords.rank === toCoords.rank) {
      // Horizontal movement
      return this.getHorizontalPath(from, to);
    }
    
    return []; // Invalid path for rook
  }

  private getVerticalPath(from: SquareNotation, to: SquareNotation): SquareNotation[] {
    const fromCoords = SquareUtil.toCoordinates(from);
    const toCoords = SquareUtil.toCoordinates(to);
    const path: SquareNotation[] = [];
    
    const direction = toCoords.rank > fromCoords.rank ? 1 : -1;
    let currentRank = fromCoords.rank + direction;
    
    while (currentRank !== toCoords.rank) {
      const square = SquareUtil.fromCoordinates({ file: fromCoords.file, rank: currentRank });
      path.push(square);
      currentRank += direction;
    }
    
    return path;
  }

  private getHorizontalPath(from: SquareNotation, to: SquareNotation): SquareNotation[] {
    const fromCoords = SquareUtil.toCoordinates(from);
    const toCoords = SquareUtil.toCoordinates(to);
    const path: SquareNotation[] = [];
    
    const direction = toCoords.file > fromCoords.file ? 1 : -1;
    let currentFile = fromCoords.file + direction;
    
    while (currentFile !== toCoords.file) {
      const square = SquareUtil.fromCoordinates({ file: currentFile, rank: fromCoords.rank });
      path.push(square);
      currentFile += direction;
    }
    
    return path;
  }

  get symbol(): string {
    return this.color === 'white' ? '♖' : '♜';
  }

  get notation(): string {
    return 'R';
  }

}
