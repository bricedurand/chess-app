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

  get symbol(): string {
    return this.color === 'white' ? '♖' : '♜';
  }

  get notation(): string {
    return 'R';
  }

  clone(): Piece {
    const clonedRook = new Rook(this.color, this.square);
    this.copyToClone(clonedRook);
    return clonedRook;
  }
}
