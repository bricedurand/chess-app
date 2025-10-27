import { Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Knight extends Piece {

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    const distance = SquareUtil.getDistance(this.square, targetSquare);
    
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

}
