import { Color } from '../types/chess';
import { Piece } from './Piece';
import { PieceFactory } from './PieceFactory';
import { King } from './pieces/King';
import { Rook } from './pieces/Rook';
import { Knight } from './pieces/Knight';
import { Bishop } from './pieces/Bishop';
import { Queen } from './pieces/Queen';
import { Square } from '../utils/Square';
import { Move } from './Move';

export class Board {
  private pieces: Map<string, Piece> = new Map();
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
      const sqWhite = new Square(`${file}2`);
      const sqBlack = new Square(`${file}7`);
      this.pieces.set(sqWhite.notation, PieceFactory.createPawn('white', sqWhite, this));
      this.pieces.set(sqBlack.notation, PieceFactory.createPawn('black', sqBlack, this));
    }

    // Place other pieces - using class constructors directly
    const pieceClasses = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];
    
    // White pieces
    pieceClasses.forEach((PieceClass, index) => {
      const file = String.fromCharCode(97 + index); // a-h
      const square = new Square(`${file}1`);
      this.pieces.set(square.notation, PieceFactory.createPiece(PieceClass, 'white', square, this));
    });

    // Black pieces
    pieceClasses.forEach((PieceClass, index) => {
      const file = String.fromCharCode(97 + index); // a-h
      const square = new Square(`${file}8`);
      this.pieces.set(square.notation, PieceFactory.createPiece(PieceClass, 'black', square, this));
    });
  }

  /**
   * Gets the piece at the specified square
   */
  getPiece(square: Square): Piece | undefined {
    return this.pieces.get(square.notation);
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
  isOccupied(square: Square): boolean {
    return this.pieces.has(square.notation);
  }

  /**
   * Checks if a square is occupied by a piece of the specified color
   */
  isOccupiedBy(square: Square, color: Color): boolean {
    const piece = this.getPiece(square);
    return piece ? piece.color === color : false;
  }

  isOccupiedByOpponent(square: Square, color: Color): boolean {
    const piece = this.getPiece(square);
    return piece ? piece.color !== color : false;
  }

  executeMove(move: Move): void {
    // remove captured piece if any
    if(move.isCapture) {
      this.pieces.delete(move.to.notation);
      this.capturedPieces.push(move.capturedPiece!);
    }

    // move piece to new square
    this.pieces.delete(move.piece.square.notation);
    this.pieces.set(move.to.notation, move.piece);
    move.piece.square = move.to;
  }

  undoMove(move: Move): void {
    // move piece to old square
    this.pieces.delete(move.to.notation);
    this.pieces.set(move.from.notation, move.piece);
    move.piece.square = move.from;

    // restore captured piece if any
    if(move.isCapture) {
      this.pieces.set(move.to.notation, move.capturedPiece!);
      this.capturedPieces.pop();
    }
  }

  getLegalMoves(piece: Piece): Move[] {
    const legalMoves: Move[] = [];

    for (const reachableSquare of piece.getReachableSquares()) {
      const candidateMove = new Move(piece.square, reachableSquare, this);

      if (!this.wouldPutKingInCheck(candidateMove)) {
        legalMoves.push(candidateMove);
      }
    }

    return legalMoves;
  }

    /**
   * Checks if the king of the specified color is in check
   */
  isKingInCheck(color: Color): boolean {
    const king = this.findKing(color);
    if (!king) return false;

    const opponentColor: Color = color === 'white' ? 'black' : 'white';
    const opponentPieces = this.getPiecesByColor(opponentColor);

    return opponentPieces.some(piece => 
      piece.getReachableSquares().some(square => square.equals(king.square))
    );
  }

  /**
   * Checks if this move would put the current player's king in check
   */
  wouldPutKingInCheck(move: Move): boolean {
    this.executeMove(move);
    
    const isInCheck = this.isKingInCheck(move.piece.color);
   
    this.undoMove(move);
    
    return isInCheck;
  }

  /**
   * Finds the king of the specified color
   */
  findKing(color: Color): Piece | undefined {
    return this.getPiecesByClass(King, color)[0];
  }

  /**
   * Returns a string representation of the board
   */
  toString(): string {
    let boardString = '  a b c d e f g h\n';
    
    for (let rank = 8; rank >= 1; rank--) {
      boardString += `${rank} `;
      for (let file = 1; file <= 8; file++) {
        const square = new Square({ file, rank });
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

