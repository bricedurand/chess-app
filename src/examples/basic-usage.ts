import { Game } from '../models/Game';

// Example of how to use the chess classes
export function demonstrateChessGame(): void {
  console.log('Starting a new chess game...\n');
  
  // Create a new game
  const game = new Game();
  
  // Display initial board
  console.log('Initial board:');
  console.log(game.getBoardString());
  console.log();
  
  // Make some moves
  try {
    console.log('Making moves...');
    
    // White pawn moves
    game.makeMove('e2', 'e4');
    console.log('1. e4');
    
    // Black pawn moves
    game.makeMove('e7', 'e5');
    console.log('1... e5');
    
    // White knight moves
    game.makeMove('g1', 'f3');
    console.log('2. Nf3');
    
    // Black knight moves
    game.makeMove('b8', 'c6');
    console.log('2... Nc6');
    
    console.log('\nBoard after moves:');
    console.log(game.getBoardString());
    
    console.log('\nMove history:');
    console.log(game.getMoveHistoryString());
    
    console.log('\nGame state:');
    const gameState = game.getGameState();
    console.log(`Current player: ${gameState.currentPlayer}`);
    console.log(`Game over: ${gameState.isGameOver}`);
    console.log(`Captured pieces: ${gameState.capturedPieces.length}`);
    
  } catch (error) {
    console.error('Error making move:', error);
  }
}

// Run the demonstration
if (require.main === module) {
  demonstrateChessGame();
}

