import { Color, SquareNotation } from '../../types/chess';
import { Piece, MoveDirection } from '../Piece';
import { Square } from '../../utils/Square';

export class Pawn extends Piece {
  getDirections(): MoveDirection[] {
    const rankDirection = this.isWhite() ? 1 : -1;
    const directions = [];

    // Pawns cannot capture moving forward, so we need to check if there is an opponent piece ahead
    const squareAhead = this.square.offset(0, rankDirection);
    if (squareAhead && !this.board.isOccupiedByOpponent(squareAhead, this.color)) {
      directions.push({ file: 0, rank: rankDirection });
      
      // If at starting position, can move two squares forward if both are unoccupied
      if (this.isAtStartingPosition()) {
        const twoSquaresAhead = this.square.offset(0, rankDirection * 2);
        if (twoSquaresAhead &&
            !this.board.isOccupiedByOpponent(twoSquaresAhead, this.color)) {
          directions.push({ file: 0, rank: rankDirection * 2 });
        }
      }
    }

    // Pawns can capture diagonally, but only if there is an opponent piece
    const captureFileDirections = [-1, 1];
    for (const fileDirection of captureFileDirections) {
      const captureSquare = this.square.offset(fileDirection, rankDirection);
      if (captureSquare && this.board.isOccupiedByOpponent(captureSquare, this.color)) {
        directions.push({ file: fileDirection, rank: rankDirection });
      }
    }

    // TODO implement en passant capture
  
    return directions;
  }

  private isAtStartingPosition(): boolean {
    const rank = this.square.coordinates.rank;
    return (this.isWhite() && rank === 2) || (this.isBlack() && rank === 7);
  }

  get symbol(): string {
    return this.isWhite() ? '♙' : '♟';
  }

  get notation(): string {
    return ''; // Pawns don't have a symbol in notation
  }
}
