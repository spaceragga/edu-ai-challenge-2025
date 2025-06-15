export class CPUPlayer {
  constructor(boardSize = 10) {
    this.boardSize = boardSize;
    this.mode = "hunt";
    this.targetQueue = [];
    this.guesses = new Set();
  }

  reset() {
    this.mode = "hunt";
    this.targetQueue = [];
    this.guesses = new Set();
  }

  makeGuess() {
    let guess;

    if (this.mode === "target" && this.targetQueue.length > 0) {
      // Target mode: attack adjacent cells
      guess = this.targetQueue.shift();

      if (this.guesses.has(guess)) {
        // If we already guessed this, try the next one
        if (this.targetQueue.length === 0) {
          this.mode = "hunt";
        }
        return this.makeGuess();
      }
    } else {
      // Hunt mode: random attack
      this.mode = "hunt";
      guess = this.getRandomGuess();
    }

    this.guesses.add(guess);
    return guess;
  }

  getRandomGuess() {
    let guess;
    let attempts = 0;
    const maxAttempts = this.boardSize * this.boardSize;

    do {
      const row = Math.floor(Math.random() * this.boardSize);
      const col = Math.floor(Math.random() * this.boardSize);
      guess = `${row}${col}`;
      attempts++;
    } while (this.guesses.has(guess) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      // Find first unguessed position
      for (let row = 0; row < this.boardSize; row++) {
        for (let col = 0; col < this.boardSize; col++) {
          const location = `${row}${col}`;
          if (!this.guesses.has(location)) {
            return location;
          }
        }
      }
    }

    return guess;
  }

  processAttackResult(location, result) {
    if (result.hit) {
      if (result.sunk) {
        // Ship sunk, return to hunt mode
        this.mode = "hunt";
        this.targetQueue = [];
      } else {
        // Hit but not sunk, switch to target mode
        this.mode = "target";
        this.addAdjacentTargets(location);
      }
    } else if (this.mode === "target" && this.targetQueue.length === 0) {
      // No more targets, return to hunt mode
      this.mode = "hunt";
    }
  }

  addAdjacentTargets(location) {
    const row = parseInt(location[0], 10);
    const col = parseInt(location[1], 10);

    const adjacentPositions = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];

    adjacentPositions.forEach(({ row: adjRow, col: adjCol }) => {
      if (this.isValidPosition(adjRow, adjCol)) {
        const adjLocation = `${adjRow}${adjCol}`;

        if (
          !this.guesses.has(adjLocation) &&
          !this.targetQueue.includes(adjLocation)
        ) {
          this.targetQueue.push(adjLocation);
        }
      }
    });
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
  }

  getMode() {
    return this.mode;
  }

  getTargetQueueSize() {
    return this.targetQueue.length;
  }
}
