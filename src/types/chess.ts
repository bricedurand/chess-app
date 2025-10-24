import { Piece } from '../models/Piece';

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

export interface GameState {
  currentPlayer: Color;
  moveHistory: any[]; // Move[] - avoiding circular import
  capturedPieces: Piece[];
  isGameOver: boolean;
  winner?: Color;
  gameResult?: 'checkmate' | 'stalemate' | 'draw';
}

