import { Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Bishop extends Piece {

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    // Bishop moves diagonally
    return SquareUtil.isSameDiagonal(this.square, targetSquare);
  }

  get symbol(): string {
    return this.color === 'white' ? '♗' : '♝';
  }

  get notation(): string {
    return 'B';
  }

}
