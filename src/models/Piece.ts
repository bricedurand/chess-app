import { PieceType, Color, SquareNotation, SquareDistance } from '../types/chess';
import { Square as SquareUtil } from '../utils/Square';

export class Piece {
  public readonly type: PieceType;
  public readonly color: Color;
  private _square!: SquareNotation;
  private _hasMoved: boolean = false;

  constructor(type: PieceType, color: Color, square: SquareNotation) {
    this.type = type;
    this.color = color;
    this.square = square;
  }

  get square(): SquareNotation {
    return this._square;
  }

  set square(newSquare: SquareNotation) {
    if (!SquareUtil.isValid(newSquare)) {
      throw new Error(`Invalid square: ${newSquare}`);
    }
    this._square = newSquare;
    this._hasMoved = true;
  }

  get hasMoved(): boolean {
    return this._hasMoved;
  }

  /**
   * Gets the Unicode symbol for this piece
   */
  get symbol(): string {
    const symbols = {
      white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
      },
      black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
      }
    };

    return symbols[this.color][this.type];
  }

  /**
   * Gets the algebraic notation symbol for this piece
   */
  get notation(): string {
    const notationMap = {
      king: 'K',
      queen: 'Q',
      rook: 'R',
      bishop: 'B',
      knight: 'N',
      pawn: '' // Pawns don't have a symbol in notation
    };

    return notationMap[this.type];
  }

  /**
   * Checks if this piece can move to the given square
   * This is a basic implementation - more complex rules would be in the Game class
   */
  canMoveTo(targetSquare: SquareNotation): boolean {
    if (!SquareUtil.isValid(targetSquare)) {
      return false;
    }

    // Can't move to the same square
    if (this.square === targetSquare) {
      return false;
    }

    // Basic movement patterns (simplified)
    const distance = SquareUtil.getDistance(this.square, targetSquare);
    
    switch (this.type) {
      case 'pawn':
        return this.canPawnMove(targetSquare, distance);
      case 'rook':
        return this.canRookMove(targetSquare, distance);
      case 'knight':
        return this.canKnightMove(distance);
      case 'bishop':
        return this.canBishopMove(targetSquare, distance);
      case 'queen':
        return this.canQueenMove(targetSquare, distance);
      case 'king':
        return this.canKingMove(distance);
      default:
        return false;
    }
  }

  private canPawnMove(targetSquare: SquareNotation, distance: SquareDistance): boolean {
    const direction = this.color === 'white' ? 1 : -1;
    const startRank = this.color === 'white' ? 2 : 7;
    const currentCoords = SquareUtil.toCoordinates(this.square);
    
    // Forward move
    if (distance.fileDistance === 0) {
      if (distance.rankDistance === 1 * direction) {
        return true;
      }
      // Two squares from starting position
      if (distance.rankDistance === 2 * direction && currentCoords.row === startRank) {
        return true;
      }
    }
    
    // Diagonal capture (simplified - would need to check for enemy piece)
    if (distance.fileDistance === 1 && distance.rankDistance === 1 * direction) {
      return true;
    }
    
    return false;
  }

  private canRookMove(targetSquare: SquareNotation, distance: SquareDistance): boolean {
    return (distance.fileDistance === 0 && distance.rankDistance > 0) ||
           (distance.rankDistance === 0 && distance.fileDistance > 0);
  }

  private canKnightMove(distance: SquareDistance): boolean {
    return (distance.fileDistance === 2 && distance.rankDistance === 1) ||
           (distance.fileDistance === 1 && distance.rankDistance === 2);
  }

  private canBishopMove(targetSquare: SquareNotation, distance: SquareDistance): boolean {
    return SquareUtil.isSameDiagonal(this.square, targetSquare);
  }

  private canQueenMove(targetSquare: SquareNotation, distance: SquareDistance): boolean {
    return this.canRookMove(targetSquare, distance) || this.canBishopMove(targetSquare, distance);
  }

  private canKingMove(distance: SquareDistance): boolean {
    return distance.fileDistance <= 1 && distance.rankDistance <= 1 && 
           (distance.fileDistance > 0 || distance.rankDistance > 0);
  }

  /**
   * Creates a copy of this piece
   */
  clone(): Piece {
    const clonedPiece = new Piece(this.type, this.color, this.square);
    if (this._hasMoved) {
      clonedPiece._hasMoved = true;
    }
    return clonedPiece;
  }

  /**
   * Returns a string representation of the piece
   */
  toString(): string {
    return `${this.color} ${this.type} at ${this.square}`;
  }
}

