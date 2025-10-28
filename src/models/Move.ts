import { SquareNotation, SquareDistance, Color } from '../types/chess';
import { Piece } from './Piece';
import { King } from './pieces/King';
import { Pawn } from './pieces/Pawn';
import { Square as SquareUtil } from '../utils/Square';
import { Board } from './Board';

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
  public readonly capturedPiece?: Piece;
  public readonly isValid: boolean;
  public readonly validationErrors: string[];
  public readonly board: Board;

  constructor(
    from: SquareNotation,
    to: SquareNotation,
    board: Board,
    moveNumber: number = 0,
    options: {
      isCapture?: boolean;
      isCheck?: boolean;
      isCheckmate?: boolean;
      notation?: string;
      capturedPiece?: Piece;
      isValid?: boolean;
      validationErrors?: string[];
    } = {}
  ) {
    if (!SquareUtil.isValid(from) || !SquareUtil.isValid(to)) {
      throw new Error('Invalid square notation');
    }

    this.from = from;
    this.to = to;
    this.board = board;
    this.piece = board.getPiece(from)!;
    this.moveNumber = moveNumber;
    this.isCapture = options.isCapture ?? !!board.getPiece(to);
    this.isCheck = options.isCheck || false;
    this.isCheckmate = options.isCheckmate || false;
    this.capturedPiece = options.capturedPiece || board.getPiece(to);
    this.isValid = options.isValid || false;
    this.validationErrors = options.validationErrors || [];
    this.notation = options.notation || this.generateNotation();
    this.timestamp = new Date();
  }

  /**
   * Validates this move against the current board state
   */
  validate(currentPlayer: Color): Move {
    const errors: string[] = [];

    // Basic validation
    if (!SquareUtil.isValid(this.from) || !SquareUtil.isValid(this.to)) {
      errors.push('Invalid square notation');
    }

    if (this.from === this.to) {
      errors.push('Cannot move to the same square');
    }

    // Check if piece exists
    if (!this.piece) {
      errors.push(`No piece at ${this.from}`);
    } else {
      // Check if it's the right player's turn
      if (this.piece.color !== currentPlayer) {
        errors.push(`It's ${currentPlayer}'s turn, but piece is ${this.piece.color}`);
      }

      // Check if piece can move to target square
      if (!this.piece.canMoveTo(this.to)) {
        errors.push(`${this.piece.name} cannot move from ${this.from} to ${this.to}`);
      }

      // Check if target square is occupied by own piece
      const targetPiece = this.board.getPiece(this.to);
      if (targetPiece && targetPiece.color === this.piece.color) {
        errors.push('Cannot capture own piece');
      }

      // Check if move would put own king in check
      if (this.board.wouldPutKingInCheck(this.from, this.to, currentPlayer)) {
        errors.push('Move would put own king in check');
      }
    }

    return new Move(
      this.from,
      this.to,
      this.board,
      this.moveNumber,
      {
        isCapture: this.isCapture,
        isCheck: this.isCheck,
        isCheckmate: this.isCheckmate,
        notation: this.notation,
        capturedPiece: this.capturedPiece,
        isValid: errors.length === 0,
        validationErrors: errors
      }
    );
  }

  /**
   * Executes this move on the board
   */
  execute(): Piece | undefined {
    if (!this.isValid) {
      throw new Error(`Cannot execute invalid move: ${this.validationErrors.join(', ')}`);
    }

    return this.board.movePiece(this.from, this.to);
  }

  /**
   * Creates a historical move from a candidate move
   */
  toHistoricalMove(moveNumber: number): Move {
    const opponentColor: Color = this.piece.color === 'white' ? 'black' : 'white';
    
    return new Move(
      this.from,
      this.to,
      this.board,
      moveNumber,
      {
        isCapture: this.isCapture,
        isCheck: this.board.isKingInCheck(opponentColor),
        isCheckmate: this.isCheckmate,
        notation: this.notation,
        capturedPiece: this.capturedPiece,
        isValid: true,
        validationErrors: []
      }
    );
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
