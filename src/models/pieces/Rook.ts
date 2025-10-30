import { SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';
import { Board } from '../Board';
import { Move } from '../Move';

export class Rook extends Piece {


  getReachableSquares(): SquareNotation[] {
    // Rook moves horizontally and vertically
    const directions = [
      { file: 0, rank: 1 },   // up
      { file: 0, rank: -1 },  // down
      { file: 1, rank: 0 },   // right
      { file: -1, rank: 0 }   // left
    ];

    const reachableSquares: SquareNotation[] = [];
    const currentCoords = SquareUtil.toCoordinates(this.square);

    for (const direction of directions) {
      let file = currentCoords.file + direction.file;
      let rank = currentCoords.rank + direction.rank;

      // Keep moving in this direction until we hit board edge, or obstruction
      while (file >= 1 && file <= 8 && rank >= 1 && rank <= 8) {
        const candidateSquare = SquareUtil.fromCoordinates({ file, rank });

        if (this.board.isOccupiedBy(candidateSquare, this.color)) {
          // Blocked by own piece
          break;
        }

        reachableSquares.push(candidateSquare);

        if (this.board.isOccupied(candidateSquare)) {
          // Capture opponent and stop
          break;
        }

        file += direction.file;
        rank += direction.rank;
      }
    }

    return reachableSquares;
  }

  get symbol(): string {
    return this.color === 'white' ? '♖' : '♜';
  }

  get notation(): string {
    return 'R';
  }

}
