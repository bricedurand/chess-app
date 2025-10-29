import { SquareNotation, Color } from '../types/chess';
import { Piece } from './Piece';
import { PieceFactory } from './PieceFactory';
import { King } from './pieces/King';
import { Rook } from './pieces/Rook';
import { Knight } from './pieces/Knight';
import { Bishop } from './pieces/Bishop';
import { Queen } from './pieces/Queen';
import { Square as SquareUtil } from '../utils/Square';

export class Board {
  private pieces: Map<SquareNotation, Piece> = new Map();
  private capturedPieces: Piece[] = [];

  constructor() {
    this.initializeBoard();
  }

  /**
   * Initializes the board with pieces in their starting positions
   */
  private initializeBoard(): void {
    // Clear existing pieces
    this.pieces.clear();
    this.capturedPieces = [];

    // Place pawns
    for (let file of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
      this.pieces.set(`${file}2`, PieceFactory.createPawn('white', `${file}2`, this));
      this.pieces.set(`${file}7`, PieceFactory.createPawn('black', `${file}7`, this));
    }

    // Place other pieces - using class constructors directly
    const pieceClasses = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
    
    // White pieces
    pieceClasses.forEach((PieceClass, index) => {
      const file = String.fromCharCode(97 + index); // a-h
      this.pieces.set(`${file}1`, PieceFactory.createPiece(PieceClass, 'white', `${file}1`, this));
    });

    // Black pieces
    pieceClasses.forEach((PieceClass, index) => {
      const file = String.fromCharCode(97 + index); // a-h
      this.pieces.set(`${file}8`, PieceFactory.createPiece(PieceClass, 'black', `${file}8`, this));
    });
  }

  /**
   * Gets the piece at the specified square
   */
  getPiece(square: SquareNotation): Piece | undefined {
    return this.pieces.get(square);
  }

  /**
   * Gets all pieces of a specific color
   */
  getPiecesByColor(color: Color): Piece[] {
    return Array.from(this.pieces.values()).filter(piece => piece.color === color);
  }

  /**
   * Gets all pieces of a specific class and color
   */
  getPiecesByClass<P extends Piece>(PieceClass: new (...args: any[]) => P, color: Color): P[] {
    return Array.from(this.pieces.values()).filter(piece => 
      piece instanceof PieceClass && piece.color === color
    ) as P[];
  }

  /**
   * Checks if a square is occupied
   */
  isOccupied(square: SquareNotation): boolean {
    return this.pieces.has(square);
  }

  /**
   * Checks if a square is occupied by a piece of the specified color
   */
  isOccupiedBy(square: SquareNotation, color: Color): boolean {
    const piece = this.getPiece(square);
    return piece ? piece.color === color : false;
  }

  /**
   * Moves a piece from one square to another
   */
  movePiece(from: SquareNotation, to: SquareNotation): Piece | undefined {
    const piece = this.pieces.get(from);
    if (!piece) {
      throw new Error(`No piece at ${from}`);
    }

    // Check if there's a piece at the destination
    const capturedPiece = this.pieces.get(to);
    if (capturedPiece) {
      this.capturedPieces.push(capturedPiece);
    }

    // Remove piece from old position
    this.pieces.delete(from);
    
    // Place piece at new position
    piece.square = to;
    this.pieces.set(to, piece);

    return capturedPiece;
  }

  /**
   * Removes a piece from the board
   */
  removePiece(square: SquareNotation): Piece | undefined {
    const piece = this.pieces.get(square);
    if (piece) {
      this.pieces.delete(square);
      this.capturedPieces.push(piece);
    }
    return piece;
  }

  /**
   * Places a piece on the board
   */
  placePiece(piece: Piece, square: SquareNotation): void {
    if (this.isOccupied(square)) {
      throw new Error(`Square ${square} is already occupied`);
    }
    
    piece.square = square;
    this.pieces.set(square, piece);
  }

  /**
   * Removes the last captured piece from the captured pieces array
   * Used for undoing temporary moves
   */
  removeLastCapturedPiece(): Piece | undefined {
    return this.capturedPieces.pop();
  }

  /**
   * Gets all captured pieces
   */
  getCapturedPieces(): Piece[] {
    return [...this.capturedPieces];
  }

  /**
   * Gets captured pieces by color
   */
  getCapturedPiecesByColor(color: Color): Piece[] {
    return this.capturedPieces.filter(piece => piece.color === color);
  }

  /**
   * Finds the king of the specified color
   */
  findKing(color: Color): Piece | undefined {
    return this.getPiecesByClass(King, color)[0];
  }

  /**
   * Gets all squares occupied by pieces of the specified color
   */
  getOccupiedSquares(color: Color): SquareNotation[] {
    return Array.from(this.pieces.entries())
      .filter(([_, piece]) => piece.color === color)
      .map(([square, _]) => square);
  }

  /**
   * Gets all empty squares
   */
  getEmptySquares(): SquareNotation[] {
    const allSquares = SquareUtil.getAllSquares();
    return allSquares.filter(square => !this.isOccupied(square));
  }


  /**
   * Checks if the king of the specified color is in check
   */
  isKingInCheck(color: Color): boolean {
    const king = this.findKing(color);
    if (!king) return false;

    const opponentColor: Color = color === 'white' ? 'black' : 'white';
    const opponentPieces = this.getPiecesByColor(opponentColor);

    return opponentPieces.some(piece => piece.canMoveTo(king.square));
  }

  /**
   * Checks if this move would put the current player's king in check
   */
  wouldPutKingInCheck(from: SquareNotation, to: SquareNotation, currentPlayer: Color): boolean {
    // Make a temporary move
    const tempCapturedPiece = this.movePiece(from, to);
    
    const isInCheck = this.isKingInCheck(currentPlayer);
    
    // Restore the original state
    this.movePiece(to, from);
    if (tempCapturedPiece) {
      this.placePiece(tempCapturedPiece, to);
      this.removeLastCapturedPiece();
    }
    
    return isInCheck;
  }


  /**
   * Returns a string representation of the board
   */
  toString(): string {
    let boardString = '  a b c d e f g h\n';
    
    for (let rank = 8; rank >= 1; rank--) {
      boardString += `${rank} `;
      for (let file = 0; file < 8; file++) {
        const square = SquareUtil.fromCoordinates({ file: file + 1, rank: rank });
        const piece = this.getPiece(square);
        boardString += piece ? piece.symbol : '·';
        boardString += ' ';
      }
      boardString += `${rank}\n`;
    }
    
    boardString += '  a b c d e f g h';
    return boardString;
  }
}

