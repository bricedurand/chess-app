import { Color, SquareNotation } from '../types/chess';
import { Piece } from './Piece';
import { Pawn } from './pieces/Pawn';
import { Rook } from './pieces/Rook';
import { Knight } from './pieces/Knight';
import { Bishop } from './pieces/Bishop';
import { Queen } from './pieces/Queen';
import { King } from './pieces/King';

export class PieceFactory {
  // Direct class-based factory methods - no strings!
  static createPawn(color: Color, square: SquareNotation): Pawn {
    return new Pawn(color, square);
  }

  static createRook(color: Color, square: SquareNotation): Rook {
    return new Rook(color, square);
  }

  static createKnight(color: Color, square: SquareNotation): Knight {
    return new Knight(color, square);
  }

  static createBishop(color: Color, square: SquareNotation): Bishop {
    return new Bishop(color, square);
  }

  static createQueen(color: Color, square: SquareNotation): Queen {
    return new Queen(color, square);
  }

  static createKing(color: Color, square: SquareNotation): King {
    return new King(color, square);
  }

  // Generic factory method using class constructors
  static createPiece<P extends Piece>(
    PieceClass: new (color: Color, square: SquareNotation) => P,
    color: Color,
    square: SquareNotation
  ): P {
    return new PieceClass(color, square);
  }
}
