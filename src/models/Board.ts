import { Square, Color, PieceType } from '../types/chess';
import { Piece } from './Piece';
import { Square as SquareUtil } from '../utils/Square';

export class Board {
  private pieces: Map<Square, Piece> = new Map();
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
      this.pieces.set(`${file}2`, new Piece('pawn', 'white', `${file}2`));
      this.pieces.set(`${file}7`, new Piece('pawn', 'black', `${file}7`));
    }

    // Place other pieces
    const pieceOrder: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    
    // White pieces
    pieceOrder.forEach((type, index) => {
      const file = String.fromCharCode(97 + index); // a-h
      this.pieces.set(`${file}1`, new Piece(type, 'white', `${file}1`));
    });

    // Black pieces
    pieceOrder.forEach((type, index) => {
      const file = String.fromCharCode(97 + index); // a-h
      this.pieces.set(`${file}8`, new Piece(type, 'black', `${file}8`));
    });
  }

  /**
   * Gets the piece at the specified square
   */
  getPiece(square: Square): Piece | undefined {
    return this.pieces.get(square);
  }

  /**
   * Gets all pieces of a specific color
   */
  getPiecesByColor(color: Color): Piece[] {
    return Array.from(this.pieces.values()).filter(piece => piece.color === color);
  }

  /**
   * Gets all pieces of a specific type and color
   */
  getPiecesByType(type: PieceType, color: Color): Piece[] {
    return Array.from(this.pieces.values()).filter(piece => 
      piece.type === type && piece.color === color
    );
  }

  /**
   * Checks if a square is occupied
   */
  isOccupied(square: Square): boolean {
    return this.pieces.has(square);
  }

  /**
   * Checks if a square is occupied by a piece of the specified color
   */
  isOccupiedBy(square: Square, color: Color): boolean {
    const piece = this.getPiece(square);
    return piece ? piece.color === color : false;
  }

  /**
   * Moves a piece from one square to another
   */
  movePiece(from: Square, to: Square): Piece | undefined {
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
  removePiece(square: Square): Piece | undefined {
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
  placePiece(piece: Piece, square: Square): void {
    if (this.isOccupied(square)) {
      throw new Error(`Square ${square} is already occupied`);
    }
    
    piece.square = square;
    this.pieces.set(square, piece);
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
    return this.getPiecesByType('king', color)[0];
  }

  /**
   * Gets all squares occupied by pieces of the specified color
   */
  getOccupiedSquares(color: Color): Square[] {
    return Array.from(this.pieces.entries())
      .filter(([_, piece]) => piece.color === color)
      .map(([square, _]) => square);
  }

  /**
   * Gets all empty squares
   */
  getEmptySquares(): Square[] {
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
   * Creates a copy of the board
   */
  clone(): Board {
    const newBoard = new Board();
    newBoard.pieces.clear();
    newBoard.capturedPieces = [];

    // Copy all pieces
    for (const [square, piece] of this.pieces) {
      newBoard.pieces.set(square, piece.clone());
    }

    // Copy captured pieces
    newBoard.capturedPieces = this.capturedPieces.map(piece => piece.clone());

    return newBoard;
  }

  /**
   * Returns a string representation of the board
   */
  toString(): string {
    let boardString = '  a b c d e f g h\n';
    
    for (let rank = 8; rank >= 1; rank--) {
      boardString += `${rank} `;
      for (let file = 0; file < 8; file++) {
        const square = String.fromCharCode(97 + file) + rank;
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

