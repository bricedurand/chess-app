// Core chess types and interfaces

export type Color = 'white' | 'black';

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export type Square = string; // e.g., "e5", "a1", "h8"

export interface Position {
  row: number; // 1-8
  col: number; // 1-8 (a-h)
}

export interface Piece {
  type: PieceType;
  color: Color;
  square: Square;
  hasMoved?: boolean; // Important for castling and pawn moves
}

export interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  moveNumber: number;
  notation?: string; // e.g., "Nf3", "O-O", "exd5"
  isCapture?: boolean;
  isCheck?: boolean;
  isCheckmate?: boolean;
}

export interface GameState {
  currentPlayer: Color;
  moveHistory: Move[];
  capturedPieces: Piece[];
  isGameOver: boolean;
  winner?: Color;
  gameResult?: 'checkmate' | 'stalemate' | 'draw';
}

