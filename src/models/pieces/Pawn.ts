import { Color, SquareNotation } from '../../types/chess';
import { Piece, MoveDirection } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Pawn extends Piece {

  getMaxSteps(): number {
    return 1;
  }

  getDirections(): MoveDirection[] {
    const rankDirection = this.isWhite() ? 1 : -1;
    const defaultMaxSteps = 1;
    const directions = [
      { file: 0, rank: rankDirection, canCapture: false, maxSteps: this.isAtStartingPosition() ? 2 : defaultMaxSteps }, // forward
      { file: -1, rank: rankDirection, maxSteps: defaultMaxSteps }, // capture left
      { file: 1, rank: rankDirection, maxSteps: defaultMaxSteps }   // capture right
    ];
  
    return directions;
  }

  private isAtStartingPosition(): boolean {
    const rank = SquareUtil.toCoordinates(this.square).rank;
    return (this.isWhite() && rank === 2) || (this.isBlack() && rank === 7);
  }

  get symbol(): string {
    return this.isWhite() ? '♙' : '♟';
  }

  get notation(): string {
    return ''; // Pawns don't have a symbol in notation
  }
}
