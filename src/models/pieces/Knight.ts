import { SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square } from '../../utils/Square';

export class Knight extends Piece {

  getMaxSteps(): number {
    return 1;
  }

  getDirections(): { file: number; rank: number }[] {
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
    return this.color === 'white' ? '♘' : '♞';
  }

  get notation(): string {
    return 'N';
  }

}
