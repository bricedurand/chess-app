import { MoveDirection, Piece } from '../Piece';

export class Rook extends Piece {
  getDirections(): MoveDirection[] {
    const maxSteps = 7;
    return [
      { file: 0, rank: 1, maxSteps },   // up
      { file: 0, rank: -1, maxSteps },  // down
      { file: 1, rank: 0, maxSteps },   // right
      { file: -1, rank: 0, maxSteps }   // left
    ];
  }

  get symbol(): string {
    return this.isWhite() ? '♖' : '♜';
  }

  get notation(): string {
    return 'R';
  }

}
