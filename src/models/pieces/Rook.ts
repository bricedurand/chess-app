import { SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';
import { Board } from '../Board';

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


  getReachableSquares(board: Board): SquareNotation[] {
    const reachableSquares: SquareNotation[] = [];
    const currentCoords = SquareUtil.toCoordinates(this.square);

    // Check all four directions: up, down, left, right
    const directions = [
      { file: 0, rank: 1 },   // up
      { file: 0, rank: -1 },  // down
      { file: 1, rank: 0 },   // right
      { file: -1, rank: 0 }   // left
    ];

    for (const direction of directions) {
      let file = currentCoords.file + direction.file;
      let rank = currentCoords.rank + direction.rank;

      // Keep moving in this direction until we hit a piece or board edge
      while (file >= 1 && file <= 8 && rank >= 1 && rank <= 8) {
        const square = SquareUtil.fromCoordinates({ file, rank });
        
        // If square is occupied by own piece, stop
        if (board.isOccupiedBy(square, this.color)) {
          break;
        }
        
        // If square is occupied by opponent piece, we can capture it
        if (board.isOccupied(square)) {
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

  get symbol(): string {
    return this.color === 'white' ? '♖' : '♜';
  }

  get notation(): string {
    return 'R';
  }

}
