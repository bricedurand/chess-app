import { SlidingDirection, SlidingPiece } from './SlidingPiece';

export class Bishop extends SlidingPiece {

  getDirections(): SlidingDirection[] {
    return[
      { file: 1, rank: 1 },   // up-right
      { file: 1, rank: -1 },  // down-right
      { file: -1, rank: 1 },  // up-left
      { file: -1, rank: -1 }  // down-left
    ];
  }

  get symbol(): string {
    return this.color === 'white' ? '♗' : '♝';
  }

  get notation(): string {
    return 'B';
  }

}
