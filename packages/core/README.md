# Core Chess Logic

Pure TypeScript chess engine with no external dependencies.

## Features

- Complete chess rules implementation
- Move validation and generation
- Check/checkmate detection
- Move history tracking
- Board state management

## Usage

```typescript
import { Game, Square } from '@chess-app/core';

const game = new Game();
game.makeMove(new Square('e2'), new Square('e4'));
console.log(game.getBoardString());
```

## Development

```bash
# Build
npm run build

# Test
npm test

# Test with coverage
npm run test:coverage
```
