import { Color, SquareNotation } from '../../types/chess';
import { Piece } from '../Piece';
import { Square as SquareUtil } from '../../utils/Square';

export class King extends Piece {


  get symbol(): string {
    return this.color === 'white' ? '♔' : '♚';
  }

  get notation(): string {
    return 'K';
  }

}
