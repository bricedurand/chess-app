import { SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';
import { Board } from '../Board';
import { Move } from '../Move';

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


  getTheoreticalSquares(): SquareNotation[] {
    // Rook moves horizontally and vertically
    const directions = [
      { file: 0, rank: 1 },   // up
      { file: 0, rank: -1 },  // down
      { file: 1, rank: 0 },   // right
      { file: -1, rank: 0 }   // left
    ];

    return this.getSlidingSquares(directions);
  }

  get symbol(): string {
    return this.color === 'white' ? '♖' : '♜';
  }

  get notation(): string {
    return 'R';
  }

}
