import { SquareDistance, Color } from '../types/chess';
import { Piece } from './Piece';
import { King } from './pieces/King';
import { Pawn } from './pieces/Pawn';
import { Square } from '../utils/Square';
import { Board } from './Board';

export class Move {
  public readonly from: Square;
  public readonly to: Square;
  public readonly piece: Piece;
  public moveNumber: number;
  public notation: string;
  public readonly isCapture: boolean;
  public isCheck: boolean;
  public isCheckmate: boolean;
  public readonly timestamp: Date;
  public readonly capturedPiece?: Piece;
  public readonly board: Board;

  constructor(
    from: Square,
    to: Square,
    board: Board,
    moveNumber: number = 0,
    options: {
      isCapture?: boolean;
      isCheck?: boolean;
      isCheckmate?: boolean;
      notation?: string;
      capturedPiece?: Piece;
    } = {}
  ) {
    // Square objects are already validated during construction
    this.from = from;
    this.to = to;
    this.board = board;
    this.piece = board.getPiece(from)!;
    this.moveNumber = moveNumber;
    this.isCapture = options.isCapture ?? !!board.getPiece(to);
    this.isCheck = options.isCheck ?? false;
    this.isCheckmate = options.isCheckmate ?? false;
    this.capturedPiece = options.capturedPiece || board.getPiece(to);
    this.notation = options.notation || this.generateNotation();
    this.timestamp = new Date();
  }

  /**
   * Generates algebraic notation for this move
   */
  private generateNotation(): string {
    const pieceSymbol = this.piece.notation;
    const captureSymbol = this.isCapture ? 'x' : '';
    const checkSymbol = this.isCheck ? '+' : '';
    const checkmateSymbol = this.isCheckmate ? '#' : '';

    // Handle special cases
    if (this.piece instanceof King && this.isCastling()) {
      const isKingside = this.to.file === 7; // 'g' is file 7
      return isKingside ? 'O-O' : 'O-O-O';
    }

    // Handle pawn promotion (simplified)
    // if (this.piece instanceof Pawn && this.isPawnPromotion()) {
    //   return `${this.to}${checkSymbol}${checkmateSymbol}`;
    // }

    // Standard notation
    return `${pieceSymbol}${captureSymbol}${this.to}${checkSymbol}${checkmateSymbol}`;
  }

  /**
   * Checks if this move is a castling move
   */
  private isCastling(): boolean {
    if (!(this.piece instanceof King)) return false;
    
    const distance = this.getDistance();
    return distance.fileDistance === 2 && distance.rankDistance === 0;
  }

  /**
   * Checks if this move is a pawn promotion
   */
  // private isPawnPromotion(): boolean {
  //   if (!(this.piece instanceof Pawn)) return false;
    
  //   const targetRank = parseInt(this.to[1]);
  //   return (this.piece.isWhite() && targetRank === 8) ||
  //          (this.piece.isBlack() && targetRank === 1);
  // }

  equals(other: Move): boolean {
    return this.from.equals(other.from) && this.to.equals(other.to);
  }

  /**
   * Gets the distance of this move
   */
  getDistance(): SquareDistance {
    return this.from.distanceTo(this.to);
  }

  /**
   * Checks if this move is a capture
   */
  isCaptureMove(): boolean {
    return this.isCapture;
  }

  /**
   * Checks if this move puts the opponent in check
   */
  isCheckMove(): boolean {
    return this.isCheck;
  }

  /**
   * Checks if this move is checkmate
   */
  isCheckmateMove(): boolean {
    return this.isCheckmate;
  }

  /**
   * Gets the algebraic notation for this move
   */
  getNotation(): string {
    return this.notation;
  }


  /**
   * Returns a string representation of the move
   */
  toString(): string {
    return `${this.moveNumber}. ${this.notation}`;
  }

  /**
   * Returns a detailed string representation of the move
   */
  toDetailedString(): string {
    return `${this.moveNumber}. ${this.piece.color} ${this.piece.name} from ${this.from} to ${this.to}${this.isCapture ? ' (capture)' : ''}${this.isCheck ? ' (check)' : ''}${this.isCheckmate ? ' (checkmate)' : ''}`;
  }
}
