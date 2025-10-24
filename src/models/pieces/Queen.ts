import { PieceType, Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class Queen extends Piece {
  get type(): PieceType {
    return 'queen';
  }

  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!this.isValidTarget(targetSquare)) {
      return false;
    }

    const distance = this.getDistance(targetSquare);
    
    // Queen moves like both rook and bishop
    const rookMove = (distance.fileDistance === 0 && distance.rankDistance > 0) ||
                     (distance.rankDistance === 0 && distance.fileDistance > 0);
    const bishopMove = SquareUtil.isSameDiagonal(this.square, targetSquare);
    
    return rookMove || bishopMove;
  }

  get symbol(): string {
    return this.color === 'white' ? '♕' : '♛';
  }

  get notation(): string {
    return 'Q';
  }

  clone(): Piece {
    const clonedQueen = new Queen(this.color, this.square);
    this.copyToClone(clonedQueen);
    return clonedQueen;
  }
}
