import { MoveDirection, SlidingPiece } from '../Piece';

export class Rook extends SlidingPiece {
  getDirections(): MoveDirection[] {
    return [
      { file: 0, rank: 1 },   // up
      { file: 0, rank: -1 },  // down
      { file: 1, rank: 0 },   // right
      { file: -1, rank: 0 }   // left
    ];
  }

  get symbol(): string {
    return this.isWhite() ? '♖' : '♜';
  }

  get notation(): string {
    return 'R';
  }

}
