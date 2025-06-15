import { Ship } from "./Ship.js";

export class Board {
  constructor(size = 10) {
    this.size = size;
    this.grid = this.createGrid();
    this.ships = [];
    this.guesses = new Set();
  }

  createGrid() {
    return Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill("~"));
  }

  isValidPosition(row, col) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  formatLocation(row, col) {
    return `${row}${col}`;
  }

  parseLocation(location) {
    if (typeof location !== "string" || location.length !== 2) {
      throw new Error("Invalid location format");
    }
    const row = parseInt(location[0], 10);
    const col = parseInt(location[1], 10);

    if (isNaN(row) || isNaN(col) || !this.isValidPosition(row, col)) {
      throw new Error("Invalid location coordinates");
    }

    return { row, col };
  }

  canPlaceShip(startRow, startCol, length, orientation) {
    const positions = this.getShipPositions(
      startRow,
      startCol,
      length,
      orientation
    );

    return positions.every(({ row, col }) => {
      return this.isValidPosition(row, col) && this.grid[row][col] === "~";
    });
  }

  getShipPositions(startRow, startCol, length, orientation) {
    const positions = [];

    for (let i = 0; i < length; i++) {
      const row = orientation === "horizontal" ? startRow : startRow + i;
      const col = orientation === "horizontal" ? startCol + i : startCol;
      positions.push({ row, col });
    }

    return positions;
  }

  placeShip(ship, startRow, startCol, orientation) {
    if (!this.canPlaceShip(startRow, startCol, ship.length, orientation)) {
      return false;
    }

    const positions = this.getShipPositions(
      startRow,
      startCol,
      ship.length,
      orientation
    );

    positions.forEach(({ row, col }) => {
      const location = this.formatLocation(row, col);
      ship.addLocation(location);
      this.grid[row][col] = "S";
    });

    this.ships.push(ship);
    return true;
  }

  placeShipsRandomly(numShips, shipLength) {
    let placedShips = 0;

    while (placedShips < numShips) {
      const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
      const maxRow =
        orientation === "horizontal" ? this.size : this.size - shipLength + 1;
      const maxCol =
        orientation === "horizontal" ? this.size - shipLength + 1 : this.size;

      const startRow = Math.floor(Math.random() * maxRow);
      const startCol = Math.floor(Math.random() * maxCol);

      const ship = new Ship(shipLength);

      if (this.placeShip(ship, startRow, startCol, orientation)) {
        placedShips++;
      }
    }
  }

  receiveAttack(location) {
    if (this.guesses.has(location)) {
      return { result: "already_guessed", hit: false, sunk: false };
    }

    this.guesses.add(location);
    const { row, col } = this.parseLocation(location);

    for (const ship of this.ships) {
      if (ship.hit(location)) {
        this.grid[row][col] = "X";
        return {
          result: "hit",
          hit: true,
          sunk: ship.isSunk(),
          ship: ship.isSunk() ? ship : null,
        };
      }
    }

    this.grid[row][col] = "O";
    return { result: "miss", hit: false, sunk: false };
  }

  getActiveShips() {
    return this.ships.filter((ship) => !ship.isSunk());
  }

  getAllSunk() {
    return this.ships.length > 0 && this.ships.every((ship) => ship.isSunk());
  }

  getGridDisplay(showShips = true) {
    return this.grid.map((row) =>
      row.map((cell) => (cell === "S" && !showShips ? "~" : cell))
    );
  }
}
