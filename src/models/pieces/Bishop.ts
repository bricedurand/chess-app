import { MoveDirection, SlidingPiece } from '../Piece';

export class Bishop extends SlidingPiece {
  getDirections(): MoveDirection[] {
    return[
      { file: 1, rank: 1 },   // up-right
      { file: 1, rank: -1 },  // down-right
      { file: -1, rank: 1 },  // up-left
      { file: -1, rank: -1 }  // down-left
    ];
  }

  get symbol(): string {
    return this.isWhite() ? '♗' : '♝';
  }

  get notation(): string {
    return 'B';
  }

}
