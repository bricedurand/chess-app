import { PieceType, Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';

export class Knight extends Piece {
  get type(): PieceType {
    return 'knight';
  }

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    const distance = this.getDistance(targetSquare);
    
    // Knight moves in L-shape: 2 squares in one direction, 1 in perpendicular
    return (distance.fileDistance === 2 && distance.rankDistance === 1) ||
           (distance.fileDistance === 1 && distance.rankDistance === 2);
  }

  get symbol(): string {
    return this.color === 'white' ? '♘' : '♞';
  }

  get notation(): string {
    return 'N';
  }

  clone(): Piece {
    const clonedKnight = new Knight(this.color, this.square);
    this.copyToClone(clonedKnight);
    return clonedKnight;
  }
}
