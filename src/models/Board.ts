import { SquareNotation, Color } from '../types/chess';
import { Piece } from './Piece';
import { PieceFactory } from './PieceFactory';
import { King } from './pieces/King';
import { Rook } from './pieces/Rook';
import { Knight } from './pieces/Knight';
import { Bishop } from './pieces/Bishop';
import { Queen } from './pieces/Queen';
import { Square as SquareUtil } from '../utils/Square';
import { Move } from './Move';

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

  isOccupiedByOpponent(square: SquareNotation, color: Color): boolean {
    const piece = this.getPiece(square);
    return piece ? piece.color !== color : false;
  }

  executeMove(move: Move): void {
    // remove captured piece if any
    if(move.isCapture) {
      this.pieces.delete(move.to);
      this.capturedPieces.push(move.capturedPiece!);
    }

    // move piece to new square
    this.pieces.delete(move.piece.square);
    this.pieces.set(move.to, move.piece);
    move.piece.square = move.to;
  }

  undoMove(move: Move): void {
    // move piece to old square
    this.pieces.delete(move.to);
    this.pieces.set(move.from, move.piece);
    move.piece.square = move.from;

    // restore captured piece if any
    if(move.isCapture) {
      this.pieces.set(move.to, move.capturedPiece!);
      this.capturedPieces.pop();
    }
  }

  getPossibleMoves(piece: Piece): Move[] {
    const reachableSquares = piece.getReachableSquares();
    return this.filterLegalMoves(piece,reachableSquares);
  }

  private filterLegalMoves(piece: Piece, reachableSquares: SquareNotation[]): Move[] {
    const legalMoves: Move[] = [];

    for (const reachableSquare of reachableSquares) {
      const candidateMove = new Move(piece.square, reachableSquare, this, 0);

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

    return opponentPieces.some(piece => piece.getReachableSquares().includes(king.square));
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

