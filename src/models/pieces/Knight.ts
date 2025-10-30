import { Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Knight extends Piece {


  getReachableSquares(): SquareNotation[] {
    const reachableSquares: SquareNotation[] = [];
    const currentCoords = SquareUtil.toCoordinates(this.square);
    const directions = [
      { file: 2, rank: 1 },
      { file: 2, rank: -1 },
      { file: -2, rank: 1 },
      { file: -2, rank: -1 },
      { file: 1, rank: 2 },
      { file: 1, rank: -2 },
      { file: -1, rank: 2 },
      { file: -1, rank: -2 },
    ];
    for (const direction of directions) {
      const candidateSquare = SquareUtil.fromCoordinates({
        file: currentCoords.file + direction.file,
        rank: currentCoords.rank + direction.rank,
      });
      if (SquareUtil.isValid(candidateSquare) && !this.board.isOccupiedBy(candidateSquare, this.color)) {
        reachableSquares.push(candidateSquare);
      }
    }
    return reachableSquares;
  }

  get symbol(): string {
    return this.color === 'white' ? '♘' : '♞';
  }

  get notation(): string {
    return 'N';
  }

}
