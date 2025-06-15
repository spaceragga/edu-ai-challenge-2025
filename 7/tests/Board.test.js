import { Board } from "../src/models/Board.js";
import { Ship } from "../src/models/Ship.js";

describe("Board", () => {
  let board;

  beforeEach(() => {
    board = new Board(10);
  });

  describe("constructor", () => {
    test("should create board with default size 10", () => {
      const defaultBoard = new Board();
      expect(defaultBoard.size).toBe(10);
      expect(defaultBoard.grid).toHaveLength(10);
      expect(defaultBoard.grid[0]).toHaveLength(10);
    });

    test("should create board with custom size", () => {
      const customBoard = new Board(5);
      expect(customBoard.size).toBe(5);
      expect(customBoard.grid).toHaveLength(5);
      expect(customBoard.grid[0]).toHaveLength(5);
    });

    test("should initialize grid with water symbols", () => {
      expect(board.grid[0][0]).toBe("~");
      expect(board.grid[5][5]).toBe("~");
      expect(board.grid[9][9]).toBe("~");
    });
  });

  describe("isValidPosition", () => {
    test("should return true for valid positions", () => {
      expect(board.isValidPosition(0, 0)).toBe(true);
      expect(board.isValidPosition(5, 5)).toBe(true);
      expect(board.isValidPosition(9, 9)).toBe(true);
    });

    test("should return false for invalid positions", () => {
      expect(board.isValidPosition(-1, 0)).toBe(false);
      expect(board.isValidPosition(0, -1)).toBe(false);
      expect(board.isValidPosition(10, 0)).toBe(false);
      expect(board.isValidPosition(0, 10)).toBe(false);
    });
  });

  describe("parseLocation", () => {
    test("should parse valid location string", () => {
      const result = board.parseLocation("34");
      expect(result).toEqual({ row: 3, col: 4 });
    });

    test("should throw error for invalid format", () => {
      expect(() => board.parseLocation("1")).toThrow("Invalid location format");
      expect(() => board.parseLocation("123")).toThrow(
        "Invalid location format"
      );
      expect(() => board.parseLocation("")).toThrow("Invalid location format");
    });

    test("should throw error for invalid coordinates", () => {
      expect(() => board.parseLocation("aa")).toThrow(
        "Invalid location coordinates"
      );
      expect(() => board.parseLocation("9a")).toThrow(
        "Invalid location coordinates"
      );
    });
  });

  describe("formatLocation", () => {
    test("should format coordinates to location string", () => {
      expect(board.formatLocation(3, 4)).toBe("34");
      expect(board.formatLocation(0, 0)).toBe("00");
      expect(board.formatLocation(9, 9)).toBe("99");
    });
  });

  describe("getShipPositions", () => {
    test("should return horizontal ship positions", () => {
      const positions = board.getShipPositions(2, 3, 3, "horizontal");
      expect(positions).toEqual([
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
      ]);
    });

    test("should return vertical ship positions", () => {
      const positions = board.getShipPositions(2, 3, 3, "vertical");
      expect(positions).toEqual([
        { row: 2, col: 3 },
        { row: 3, col: 3 },
        { row: 4, col: 3 },
      ]);
    });
  });

  describe("canPlaceShip", () => {
    test("should return true for valid horizontal placement", () => {
      expect(board.canPlaceShip(0, 0, 3, "horizontal")).toBe(true);
    });

    test("should return true for valid vertical placement", () => {
      expect(board.canPlaceShip(0, 0, 3, "vertical")).toBe(true);
    });

    test("should return false when ship goes off board horizontally", () => {
      expect(board.canPlaceShip(0, 8, 3, "horizontal")).toBe(false);
    });

    test("should return false when ship goes off board vertically", () => {
      expect(board.canPlaceShip(8, 0, 3, "vertical")).toBe(false);
    });

    test("should return false when position is occupied", () => {
      board.grid[0][0] = "S";
      expect(board.canPlaceShip(0, 0, 3, "horizontal")).toBe(false);
    });
  });

  describe("placeShip", () => {
    let ship;

    beforeEach(() => {
      ship = new Ship(3);
    });

    test("should place ship horizontally", () => {
      const result = board.placeShip(ship, 0, 0, "horizontal");

      expect(result).toBe(true);
      expect(board.grid[0][0]).toBe("S");
      expect(board.grid[0][1]).toBe("S");
      expect(board.grid[0][2]).toBe("S");
      expect(ship.locations).toEqual(["00", "01", "02"]);
      expect(board.ships).toContain(ship);
    });

    test("should place ship vertically", () => {
      const result = board.placeShip(ship, 0, 0, "vertical");

      expect(result).toBe(true);
      expect(board.grid[0][0]).toBe("S");
      expect(board.grid[1][0]).toBe("S");
      expect(board.grid[2][0]).toBe("S");
      expect(ship.locations).toEqual(["00", "10", "20"]);
    });

    test("should return false for invalid placement", () => {
      const result = board.placeShip(ship, 8, 8, "horizontal");
      expect(result).toBe(false);
      expect(board.ships).not.toContain(ship);
    });
  });

  describe("placeShipsRandomly", () => {
    test("should place specified number of ships", () => {
      board.placeShipsRandomly(2, 3);
      expect(board.ships).toHaveLength(2);

      // Count ship positions on grid
      let shipPositions = 0;
      for (let row = 0; row < board.size; row++) {
        for (let col = 0; col < board.size; col++) {
          if (board.grid[row][col] === "S") {
            shipPositions++;
          }
        }
      }
      expect(shipPositions).toBe(6); // 2 ships * 3 length
    });
  });

  describe("receiveAttack", () => {
    let ship;

    beforeEach(() => {
      ship = new Ship(3);
      board.placeShip(ship, 0, 0, "horizontal");
    });

    test("should return hit result when ship is hit", () => {
      const result = board.receiveAttack("00");

      expect(result.result).toBe("hit");
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(false);
      expect(board.grid[0][0]).toBe("X");
    });

    test("should return sunk result when ship is sunk", () => {
      board.receiveAttack("00");
      board.receiveAttack("01");
      const result = board.receiveAttack("02");

      expect(result.result).toBe("hit");
      expect(result.hit).toBe(true);
      expect(result.sunk).toBe(true);
      expect(result.ship).toBe(ship);
    });

    test("should return miss result when no ship is hit", () => {
      const result = board.receiveAttack("99");

      expect(result.result).toBe("miss");
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
      expect(board.grid[9][9]).toBe("O");
    });

    test("should return already_guessed for repeated attacks", () => {
      board.receiveAttack("00");
      const result = board.receiveAttack("00");

      expect(result.result).toBe("already_guessed");
      expect(result.hit).toBe(false);
      expect(result.sunk).toBe(false);
    });
  });

  describe("getActiveShips", () => {
    test("should return all ships when none are sunk", () => {
      board.placeShipsRandomly(2, 3);
      expect(board.getActiveShips()).toHaveLength(2);
    });

    test("should return only active ships", () => {
      const ship1 = new Ship(2);
      const ship2 = new Ship(2);

      board.placeShip(ship1, 0, 0, "horizontal");
      board.placeShip(ship2, 2, 0, "horizontal");

      // Sink first ship
      board.receiveAttack("00");
      board.receiveAttack("01");

      const activeShips = board.getActiveShips();
      expect(activeShips).toHaveLength(1);
      expect(activeShips[0]).toBe(ship2);
    });
  });

  describe("getAllSunk", () => {
    test("should return false when no ships placed", () => {
      expect(board.getAllSunk()).toBe(false);
    });

    test("should return false when ships are active", () => {
      board.placeShipsRandomly(1, 3);
      expect(board.getAllSunk()).toBe(false);
    });

    test("should return true when all ships are sunk", () => {
      const ship = new Ship(2);
      board.placeShip(ship, 0, 0, "horizontal");

      board.receiveAttack("00");
      board.receiveAttack("01");

      expect(board.getAllSunk()).toBe(true);
    });
  });

  describe("getGridDisplay", () => {
    test("should return grid with ships visible when showShips is true", () => {
      const ship = new Ship(2);
      board.placeShip(ship, 0, 0, "horizontal");

      const display = board.getGridDisplay(true);
      expect(display[0][0]).toBe("S");
      expect(display[0][1]).toBe("S");
    });

    test("should return grid with ships hidden when showShips is false", () => {
      const ship = new Ship(2);
      board.placeShip(ship, 0, 0, "horizontal");

      const display = board.getGridDisplay(false);
      expect(display[0][0]).toBe("~");
      expect(display[0][1]).toBe("~");
    });

    test("should show hits and misses regardless of showShips", () => {
      const ship = new Ship(2);
      board.placeShip(ship, 0, 0, "horizontal");

      board.receiveAttack("00"); // hit
      board.receiveAttack("99"); // miss

      const display = board.getGridDisplay(false);
      expect(display[0][0]).toBe("X");
      expect(display[9][9]).toBe("O");
    });
  });
});
