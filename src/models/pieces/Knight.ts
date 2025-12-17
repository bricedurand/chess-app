import { MoveDirection, Piece } from '../Piece';
export class Knight extends Piece {
  getDirections(): MoveDirection[] {
    const maxSteps = 1;
    return [
      { file: 2, rank: 1, maxSteps },
      { file: 2, rank: -1, maxSteps },
      { file: -2, rank: 1, maxSteps },
      { file: -2, rank: -1, maxSteps },
      { file: 1, rank: 2, maxSteps },
      { file: 1, rank: -2, maxSteps },
      { file: -1, rank: 2, maxSteps },
      { file: -1, rank: -2, maxSteps },
    ];
  }

  get symbol(): string {
    return this.color === 'white' ? '♘' : '♞';
  }

  get notation(): string {
    return 'N';
  }

}
