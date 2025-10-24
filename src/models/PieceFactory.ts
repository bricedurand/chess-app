import { PieceType, Color, SquareNotation } from '../types/chess';
import { Piece } from './Piece';
import { Pawn } from './pieces/Pawn';
import { Rook } from './pieces/Rook';
import { Knight } from './pieces/Knight';
import { Bishop } from './pieces/Bishop';
import { Queen } from './pieces/Queen';
import { King } from './pieces/King';

export class PieceFactory {
  static createPiece(type: PieceType, color: Color, square: SquareNotation): Piece {
    switch (type) {
      case 'pawn':
        return new Pawn(color, square);
      case 'rook':
        return new Rook(color, square);
      case 'knight':
        return new Knight(color, square);
      case 'bishop':
        return new Bishop(color, square);
      case 'queen':
        return new Queen(color, square);
      case 'king':
        return new King(color, square);
      default:
        throw new Error(`Unknown piece type: ${type}`);
    }
  }
}
