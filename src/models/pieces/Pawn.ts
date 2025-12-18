import { Color, SquareNotation } from '../../types/chess';
import { Piece, MoveDirection } from '../Piece';
import { Square } from '../../utils/Square';

export class Pawn extends Piece {
  getDirections(): MoveDirection[] {
    const rankDirection = this.isWhite() ? 1 : -1;
    const defaultMaxSteps = 1;
    const directions = [
      { file: -1, rank: rankDirection, maxSteps: defaultMaxSteps }, // capture left
      { file: 1, rank: rankDirection, maxSteps: defaultMaxSteps }   // capture right
    ];

    // Pawns cannot capture moving forward, so we need to check if there is an opponent piece ahead
    const squareAhead = Square.offset(this.square, 0, rankDirection);
    if (squareAhead && !this.board.isOccupiedByOpponent(squareAhead, this.color)) {
      let direction = { file: 0, rank: rankDirection, maxSteps: 1 }
      
      // If at starting position, can move two squares forward if both are unoccupied
      if (this.isAtStartingPosition()) {
        const twoSquaresAhead = Square.offset(this.square, 0, rankDirection * 2);
        if (twoSquaresAhead &&
            !this.board.isOccupiedByOpponent(twoSquaresAhead, this.color)) {
          direction.maxSteps = 2;
        }
      }
      directions.push(direction);
    }
  
    return directions;
  }

  private isAtStartingPosition(): boolean {
    const rank = Square.toCoordinates(this.square).rank;
    return (this.isWhite() && rank === 2) || (this.isBlack() && rank === 7);
  }

  get symbol(): string {
    return this.isWhite() ? '♙' : '♟';
  }

  get notation(): string {
    return ''; // Pawns don't have a symbol in notation
  }
}
