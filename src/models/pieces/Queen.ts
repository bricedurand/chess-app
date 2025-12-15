import { SlidingDirection, SlidingPiece } from './SlidingPiece';

export class Queen extends SlidingPiece {

  // TODO : refactor to use directions from Rook and Bishop
  getDirections(): SlidingDirection[] {
    return [
      { file: 0, rank: 1 },    // up
      { file: 0, rank: -1 },   // down
      { file: 1, rank: 0 },    // right
      { file: -1, rank: 0 },   // left
      { file: 1, rank: 1 },    // up-right
      { file: 1, rank: -1 },   // down-right
      { file: -1, rank: 1 },   // up-left
      { file: -1, rank: -1 }   // down-left
    ];
  }

  get symbol(): string {
    return this.color === 'white' ? '♕' : '♛';
  }

  get notation(): string {
    return 'Q';
  }

}
