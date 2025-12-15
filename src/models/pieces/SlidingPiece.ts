import { SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square } from '../../utils/Square';

export interface SlidingDirection {
  file: number;
  rank: number;
}

export abstract class SlidingPiece extends Piece {
  abstract getDirections(): SlidingDirection[];
  
  getMaxSteps(): number {
    return 7;
  }

  getReachableSquares(): SquareNotation[] {
    const reachableSquares: SquareNotation[] = [];
    const currentCoords = Square.toCoordinates(this.square);
    const directions = this.getDirections();

    for (const direction of directions) {
      let file = currentCoords.file + direction.file;
      let rank = currentCoords.rank + direction.rank;
      let steps = 1;

      while (file >= 1 && file <= 8 && rank >= 1 && rank <= 8 && steps <= this.getMaxSteps()) {
        const square = Square.fromCoordinates({ file, rank });

        // Stop if occupied by own piece
        if (this.board.isOccupiedBy(square, this.color)) {
          break;
        }

        // Can capture opponent piece but stop afterwards
        if (this.board.isOccupiedByOpponent(square, this.color)) {
          reachableSquares.push(square);
          break;
        }

        reachableSquares.push(square);
        file += direction.file;
        rank += direction.rank;
        steps++;
      }
    }

    return reachableSquares;
  }
}
