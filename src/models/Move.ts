import { SquareNotation, SquareDistance } from '../types/chess';
import { Piece } from './Piece';
import { King } from './pieces/King';
import { Pawn } from './pieces/Pawn';
import { Square as SquareUtil } from '../utils/Square';

export class Move {
  public readonly from: SquareNotation;
  public readonly to: SquareNotation;
  public readonly piece: Piece;
  public readonly moveNumber: number;
  public readonly notation: string;
  public readonly isCapture: boolean;
  public readonly isCheck: boolean;
  public readonly isCheckmate: boolean;
  public readonly timestamp: Date;

  constructor(
    from: SquareNotation,
    to: SquareNotation,
    piece: Piece,
    moveNumber: number,
    options: {
      isCapture?: boolean;
      isCheck?: boolean;
      isCheckmate?: boolean;
      notation?: string;
    } = {}
  ) {
    if (!SquareUtil.isValid(from) || !SquareUtil.isValid(to)) {
      throw new Error('Invalid square notation');
    }

    this.from = from;
    this.to = to;
    this.piece = piece;
    this.moveNumber = moveNumber;
    this.isCapture = options.isCapture || false;
    this.isCheck = options.isCheck || false;
    this.isCheckmate = options.isCheckmate || false;
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
      const isKingside = this.to[0] === 'g';
      return isKingside ? 'O-O' : 'O-O-O';
    }

    // Handle pawn promotion (simplified)
    if (this.piece instanceof Pawn && this.isPawnPromotion()) {
      return `${this.to}${checkSymbol}${checkmateSymbol}`;
    }

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
  private isPawnPromotion(): boolean {
    if (!(this.piece instanceof Pawn)) return false;
    
    const targetRank = parseInt(this.to[1]);
    return (this.piece.color === 'white' && targetRank === 8) ||
           (this.piece.color === 'black' && targetRank === 1);
  }

  /**
   * Gets the distance of this move
   */
  getDistance(): SquareDistance {
    return SquareUtil.getDistance(this.from, this.to);
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
