import { Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';

export class King extends Piece {

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    const distance = this.getDistance(targetSquare);
    
    // King moves one square in any direction
    return distance.fileDistance <= 1 && distance.rankDistance <= 1 && 
           (distance.fileDistance > 0 || distance.rankDistance > 0);
  }

  get symbol(): string {
    return this.color === 'white' ? '♔' : '♚';
  }

  get notation(): string {
    return 'K';
  }

  clone(): Piece {
    const clonedKing = new King(this.color, this.square);
    this.copyToClone(clonedKing);
    return clonedKing;
  }
}
