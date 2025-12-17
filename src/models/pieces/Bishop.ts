import { Piece, MoveDirection } from '../Piece';

export class Bishop extends Piece {
  getDirections(): MoveDirection[] {
    const maxSteps = 7;
    return[
      { file: 1, rank: 1, maxSteps },   // up-right
      { file: 1, rank: -1, maxSteps },  // down-right
      { file: -1, rank: 1, maxSteps },  // up-left
      { file: -1, rank: -1, maxSteps }  // down-left
    ];
  }

  get symbol(): string {
    return this.isWhite() ? '♗' : '♝';
  }

  get notation(): string {
    return 'B';
  }

}
