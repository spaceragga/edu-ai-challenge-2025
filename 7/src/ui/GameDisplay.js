export class GameDisplay {
  constructor(boardSize = 10) {
    this.boardSize = boardSize;
  }

  printBoard(playerBoard, opponentBoard) {
    console.log("\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---");

    const header = this.createHeader();
    console.log(`${header}     ${header}`);

    for (let i = 0; i < this.boardSize; i++) {
      const opponentRow = this.formatRow(
        i,
        opponentBoard.getGridDisplay(false)
      );
      const playerRow = this.formatRow(i, playerBoard.getGridDisplay(true));
      console.log(`${opponentRow}    ${playerRow}`);
    }

    console.log("\n");
  }

  createHeader() {
    let header = "  ";
    for (let i = 0; i < this.boardSize; i++) {
      header += `${i} `;
    }
    return header;
  }

  formatRow(rowIndex, grid) {
    let rowStr = `${rowIndex} `;
    for (let j = 0; j < grid[rowIndex].length; j++) {
      rowStr += `${grid[rowIndex][j]} `;
    }
    return rowStr;
  }

  showWelcomeMessage(numShips) {
    console.log("\nLet's play Sea Battle!");
    console.log(`Try to sink the ${numShips} enemy ships.`);
  }

  showPlayerWin() {
    console.log("\n*** CONGRATULATIONS! You sunk all enemy battleships! ***");
  }

  showPlayerLose() {
    console.log("\n*** GAME OVER! The CPU sunk all your battleships! ***");
  }

  showPlayerTurn() {
    // This is handled by the readline interface in the main game
  }

  showCPUTurn() {
    console.log("\n--- CPU's Turn ---");
  }

  showPlayerHit() {
    console.log("PLAYER HIT!");
  }

  showPlayerMiss() {
    console.log("PLAYER MISS.");
  }

  showPlayerShipSunk() {
    console.log("You sunk an enemy battleship!");
  }

  showCPUHit(location) {
    console.log(`CPU HIT at ${location}!`);
  }

  showCPUMiss(location) {
    console.log(`CPU MISS at ${location}.`);
  }

  showCPUShipSunk() {
    console.log("CPU sunk your battleship!");
  }

  showCPUTarget(location) {
    console.log(`CPU targets: ${location}`);
  }

  showInvalidInput() {
    console.log("Oops, input must be exactly two digits (e.g., 00, 34, 98).");
  }

  showInvalidCoordinates(boardSize) {
    console.log(
      `Oops, please enter valid row and column numbers between 0 and ${
        boardSize - 1
      }.`
    );
  }

  showAlreadyGuessed() {
    console.log("You already guessed that location!");
  }

  showShipsPlaced(count, player) {
    console.log(`${count} ships placed randomly for ${player}.`);
  }

  showBoardsCreated() {
    console.log("Boards created.");
  }
}
