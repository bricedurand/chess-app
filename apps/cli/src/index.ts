import * as readline from 'readline';
import { Game, Square } from '@chess-app/core';

class ChessCLI {
  private game: Game;
  private rl: readline.Interface;

  constructor() {
    this.game = new Game();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  start(): void {
    console.log('Welcome to Chess CLI!\n');
    console.log('Enter moves in the format: e2 e4');
    console.log('Type "quit" to exit, "reset" to start a new game, "undo" to undo last move\n');
    
    this.displayBoard();
    this.promptMove();
  }

  private displayBoard(): void {
    console.log('\n' + this.game.getBoardString() + '\n');
    
    const state = this.game.getGameState();
    
    if (state.isCheckmate) {
      console.log(`Checkmate! ${state.winner} wins!`);
    } else if (state.isStalemate) {
      console.log('Stalemate! The game is a draw.');
    } else if (state.isCheck) {
      console.log(`${state.currentPlayer} is in check!`);
    }
    
    console.log(`Current player: ${state.currentPlayer}`);
  }

  private promptMove(): void {
    if (this.game.getGameState().isGameOver) {
      this.rl.question('\nGame over. Type "reset" for a new game or "quit" to exit: ', (input) => {
        this.handleInput(input.trim().toLowerCase());
      });
      return;
    }

    this.rl.question(`\n${this.game.getCurrentPlayer()}'s move: `, (input) => {
      this.handleInput(input.trim().toLowerCase());
    });
  }

  private handleInput(input: string): void {
    if (input === 'quit' || input === 'exit') {
      console.log('\nThanks for playing!');
      this.rl.close();
      return;
    }

    if (input === 'reset') {
      this.game.reset();
      console.log('\nGame reset!\n');
      this.displayBoard();
      this.promptMove();
      return;
    }

    if (input === 'undo') {
      const success = this.game.undoMove();
      if (success) {
        console.log('\nMove undone.');
        this.displayBoard();
      } else {
        console.log('\nNo moves to undo.');
      }
      this.promptMove();
      return;
    }

    // Parse move in format "e2 e4"
    const moveParts = input.split(' ').filter(part => part.length > 0);
    
    if (moveParts.length !== 2) {
      console.log('\nInvalid format. Use: e2 e4');
      this.promptMove();
      return;
    }

    try {
      const from = new Square(moveParts[0]);
      const to = new Square(moveParts[1]);
      
      this.game.makeMove(from, to);
      this.displayBoard();
      
    } catch (error) {
      if (error instanceof Error) {
        console.log(`\nError: ${error.message}`);
      } else {
        console.log('\nAn unknown error occurred.');
      }
    }

    this.promptMove();
  }
}

// Start the CLI app
const cli = new ChessCLI();
cli.start();
