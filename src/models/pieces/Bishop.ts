import { Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';
import { Board } from '../Board';

export class Bishop extends Piece {

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    // Bishop moves diagonally
    return SquareUtil.isSameDiagonal(this.square, targetSquare);
  }

  getReachableSquares(): SquareNotation[] {
    // Bishop moves diagonally
    const directions = [
      { file: 1, rank: 1 },   // up-right
      { file: 1, rank: -1 },  // down-right
      { file: -1, rank: 1 },  // up-left
      { file: -1, rank: -1 }  // down-left
    ];

    return this.getSlidingMoves(directions);
  }

  get symbol(): string {
    return this.color === 'white' ? '♗' : '♝';
  }

  get notation(): string {
    return 'B';
  }

}
