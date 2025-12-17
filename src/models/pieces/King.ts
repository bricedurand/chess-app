import { Piece, MoveDirection } from '../Piece';
export class King extends Piece {
  getDirections(): MoveDirection[] {
    const maxSteps = 1;
    return [
      { file: 1, rank: 0, maxSteps },
      { file: 1, rank: 1, maxSteps },
      { file: 0, rank: 1, maxSteps },
      { file: -1, rank: 1, maxSteps },
      { file: -1, rank: 0, maxSteps },
      { file: -1, rank: -1, maxSteps },
      { file: 0, rank: -1, maxSteps },
      { file: 1, rank: -1, maxSteps },
    ];
  }

  getMaxSteps(): number {
    return 1;
  }

  get symbol(): string {
    return this.color === 'white' ? '♔' : '♚';
  }

  get notation(): string {
    return 'K';
  }
}
