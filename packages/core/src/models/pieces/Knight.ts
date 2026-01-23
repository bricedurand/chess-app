import { MoveDirection, Piece } from '../Piece';
export class Knight extends Piece {
  getDirections(): MoveDirection[] {
    return [
      { file: 2, rank: 1 },
      { file: 2, rank: -1 },
      { file: -2, rank: 1 },
      { file: -2, rank: -1 },
      { file: 1, rank: 2 },
      { file: 1, rank: -2 },
      { file: -1, rank: 2 },
      { file: -1, rank: -2 },
    ];
  }

  get symbol(): string {
    return this.isWhite() ? '♘' : '♞';
  }

  get notation(): string {
    return 'N';
  }

}
