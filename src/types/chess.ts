// Core chess types and interfaces

export type Color = 'white' | 'black';

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export type SquareNotation = string; // e.g., "e5", "a1", "h8"

export interface SquareCoordinates {
  file: number; // 1-8 (a-h)
  rank: number; // 1-8 (1-8)
}

export interface SquareDistance {
  fileDistance: number; // Horizontal distance
  rankDistance: number; // Vertical distance
}

export interface Piece {
  type: PieceType;
  color: Color;
  square: SquareNotation;
  hasMoved?: boolean; // Important for castling and pawn moves
}

export interface Move {
  from: SquareNotation;
  to: SquareNotation;
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

