import { Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Pawn extends Piece {

  getReachableSquares(): SquareNotation[] {
    const reachableSquares: SquareNotation[] = [];
    const currentCoords = SquareUtil.toCoordinates(this.square);
    const direction = this.color === 'white' ? 1 : -1;
    const startRank = this.color === 'white' ? 2 : 7;
    
    // One square forward
    const oneForwardSquare = SquareUtil.fromCoordinates({ file: currentCoords.file, rank: currentCoords.rank + direction });
    if (SquareUtil.isValid(oneForwardSquare) && !this.board.isOccupied(oneForwardSquare)) {
      reachableSquares.push(oneForwardSquare);

      // Two squares forward from starting position
      if (currentCoords.rank === startRank) {
        const twoForwardSquare = SquareUtil.fromCoordinates({ file: currentCoords.file, rank: currentCoords.rank + 2 * direction });
        if (SquareUtil.isValid(twoForwardSquare) && !this.board.isOccupied(twoForwardSquare)) {
          reachableSquares.push(twoForwardSquare);
        }
      }
    }
    // Captures
    const captureDirections = [-1, 1];
    for (const direction of captureDirections) {
      const captureSquare = SquareUtil.fromCoordinates({ file: currentCoords.file + direction, rank: currentCoords.rank + direction });
      if (SquareUtil.isValid(captureSquare) && this.board.isOccupiedByOpponent(captureSquare, this.color)) {
        reachableSquares.push(captureSquare);
      }
    }
    return reachableSquares;
  }


  get symbol(): string {
    return this.color === 'white' ? '♙' : '♟';
  }

  get notation(): string {
    return ''; // Pawns don't have a symbol in notation
  }
}
