import { PieceType, Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';

export class Rook extends Piece {
  get type(): PieceType {
    return 'rook';
  }

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    const distance = this.getDistance(targetSquare);
    
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
