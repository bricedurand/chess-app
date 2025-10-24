import { PieceType, Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Pawn extends Piece {
  get type(): PieceType {
    return 'pawn';
  }

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    const distance = this.getDistance(targetSquare);
    const direction = this.color === 'white' ? 1 : -1;
    const startRank = this.color === 'white' ? 2 : 7;
    const currentCoords = SquareUtil.toCoordinates(this.square);
    
    // Forward move
    if (distance.fileDistance === 0) {
      if (distance.rankDistance === 1 * direction) {
        return true;
      }
      // Two squares from starting position
      if (distance.rankDistance === 2 * direction && currentCoords.rank === startRank) {
        return true;
      }
    }
    
    // Diagonal capture (simplified - would need to check for enemy piece)
    if (distance.fileDistance === 1 && distance.rankDistance === 1 * direction) {
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

  clone(): Piece {
    const clonedPawn = new Pawn(this.color, this.square);
    this.copyToClone(clonedPawn);
    return clonedPawn;
  }
}
