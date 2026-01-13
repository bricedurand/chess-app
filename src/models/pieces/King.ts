import { Piece, MoveDirection } from '../Piece';
export class King extends Piece {
  getDirections(): MoveDirection[] {
    return [
      { file: 1, rank: 0 },
      { file: 1, rank: 1 },
      { file: 0, rank: 1 },
      { file: -1, rank: 1 },
      { file: -1, rank: 0 },
      { file: -1, rank: -1 },
      { file: 0, rank: -1 },
      { file: 1, rank: -1 },
    ];
  }

  getMaxSteps(): number {
    return 1;
  }

  get symbol(): string {
    return this.isWhite() ? '♔' : '♚';
  }

  get notation(): string {
    return 'K';
  }
}
