import { Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Pawn extends Piece {

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    const currentCoords = SquareUtil.toCoordinates(this.square);
    const targetCoords = SquareUtil.toCoordinates(targetSquare);
    const direction = this.color === 'white' ? 1 : -1;
    const startRank = this.color === 'white' ? 2 : 7;
    
    // Calculate actual rank distance (preserving direction)
    const rankDistance = targetCoords.rank - currentCoords.rank;
    const fileDistance = Math.abs(targetCoords.file - currentCoords.file);
    
    // Forward move
    if (fileDistance === 0) {
      if (rankDistance === 1 * direction) {
        return true;
      }
      // Two squares from starting position
      if (rankDistance === 2 * direction && currentCoords.rank === startRank) {
        return true;
      }
    }
    
    // Diagonal capture (simplified - would need to check for enemy piece)
    if (fileDistance === 1 && rankDistance === 1 * direction) {
      return true;
    }
    
    return false;
  }

  get symbol(): string {
    return this.color === 'white' ? '♙' : '♟';
  }

  get notation(): string {
    return ''; // Pawns don't have a symbol in notation
  }

}
