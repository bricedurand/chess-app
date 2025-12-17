import { Color, SquareNotation } from '../../types/chess';
import { Piece, MoveDirection } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Pawn extends Piece {

  getMaxSteps(): number {
    return 1;
  }

  getDirections(): MoveDirection[] {
    const rankDirection = this.color === 'white' ? 1 : -1;
    const directions = [
      { file: 0, rank: rankDirection, canCapture: false, maxSteps: this.isAtStartingPosition() ? 2 : 1 }, // forward
      { file: -1, rank: rankDirection }, // capture left
      { file: 1, rank: rankDirection }   // capture right
    ];
  
    return directions;
  }

  private isAtStartingPosition(): boolean {
    const rank = SquareUtil.toCoordinates(this.square).rank;
    return (this.color === 'white' && rank === 2) || (this.color === 'black' && rank === 7);
  }

  get symbol(): string {
    return this.color === 'white' ? '♙' : '♟';
  }

  get notation(): string {
    return ''; // Pawns don't have a symbol in notation
  }
}
