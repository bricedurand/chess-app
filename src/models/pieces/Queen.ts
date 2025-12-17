import { Piece, MoveDirection } from '../Piece';
export class Queen extends Piece {
  // TODO : refactor to use directions from Rook and Bishop
  getDirections(): MoveDirection[] {
    const maxSteps = 7;
    return [
      { file: 0, rank: 1, maxSteps },    // up
      { file: 0, rank: -1, maxSteps },   // down
      { file: 1, rank: 0, maxSteps },    // right
      { file: -1, rank: 0, maxSteps },   // left
      { file: 1, rank: 1, maxSteps },    // up-right
      { file: 1, rank: -1, maxSteps },   // down-right
      { file: -1, rank: 1, maxSteps },   // up-left
      { file: -1, rank: -1, maxSteps }   // down-left
    ];
  }

  get symbol(): string {
    return this.isWhite() ? '♕' : '♛';
  }

  get notation(): string {
    return 'Q';
  }

}
