import { Move } from '../Move';
import { Piece, MoveDirection } from '../Piece';
import { Square } from '../../utils/Square';
import { Rook } from './Rook';

export class King extends Piece {
  getDirections(): MoveDirection[] {
    return [
      { file: 1, rank: 0 },
      { file: 1, rank: 1 },
      { file: 0, rank: 1 },
      { file: -1, rank: 1 },
      { file: -1, rank: 0 },
      { file: -1, rank: -1 },
      { file: 0, rank: -1 },
      { file: 1, rank: -1 },
    ];
  }

  override getReachableSquares(): Square[] {
    const reachableSquares = super.getReachableSquares();

    // Add castling moves if eligible
    // Only check basic castling preconditions (king/rook unmoved, empty squares)
    // Legality checks (not in/through/into check) are handled by board.getLegalMoves()
    if (!this.hasMoved) {
      // Kingside castling
      if (this.canCastle(true)) {
        const castleSquare = new Square({ file: 7, rank: this.square.rank });
        reachableSquares.push(castleSquare);
      }

      // Queenside castling
      if (this.canCastle(false)) {
        const castleSquare = new Square({ file: 3, rank: this.square.rank });
        reachableSquares.push(castleSquare);
      }
    }

    return reachableSquares;
  }

  private canCastle(isKingside: boolean): boolean {
    const rank = this.square.rank;
    const rookFile = isKingside ? 8 : 1;
    const rookSquare = new Square({ file: rookFile, rank });
    const rook = this.board.getPiece(rookSquare);
    
    // Check if rook exists and hasn't moved
    if (!(rook instanceof Rook) || rook.hasMoved) {
      return false;
    }

    // Define squares to check based on castling side
    const squaresToCheck = isKingside
      ? [6, 7]  // f, g
      : [2, 3, 4];  // b, c, d

    // Check if all squares between king and rook are empty
    for (const file of squaresToCheck) {
      const square = new Square({ file, rank });
      if (!this.board.isEmpty(square)) {
        return false;
      }
    }

    return true;
  }

  get symbol(): string {
    return this.isWhite() ? '♔' : '♚';
  }

  get notation(): string {
    return 'K';
  }
}
