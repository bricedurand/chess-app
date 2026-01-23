import { Color } from '../types/chess';
import { Piece } from './Piece';
import { Pawn } from './pieces/Pawn';
import { Rook } from './pieces/Rook';
import { Knight } from './pieces/Knight';
import { Bishop } from './pieces/Bishop';
import { Queen } from './pieces/Queen';
import { King } from './pieces/King';
import { Square } from '../utils/Square';
import { Board } from './Board';

export class PieceFactory {
  // Direct class-based factory methods - no strings!
  static createPawn(color: Color, square: Square, board: Board): Pawn {
    return new Pawn(color, square, board);
  }

  static createRook(color: Color, square: Square, board: Board): Rook {
    return new Rook(color, square, board);
  }

  static createKnight(color: Color, square: Square, board: Board): Knight {
    return new Knight(color, square, board);
  }

  static createBishop(color: Color, square: Square, board: Board): Bishop {
    return new Bishop(color, square, board);
  }

  static createQueen(color: Color, square: Square, board: Board): Queen {
    return new Queen(color, square, board);
  }

  static createKing(color: Color, square: Square, board: Board): King {
    return new King(color, square, board);
  }

  // Generic factory method using class constructors
  static createPiece<P extends Piece>(
    PieceClass: new (color: Color, square: Square, board: Board) => P,
    color: Color,
    square: Square,
    board: Board
  ): P {
    return new PieceClass(color, square, board);
  }
}
