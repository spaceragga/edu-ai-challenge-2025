import { GameDisplay } from "../src/ui/GameDisplay.js";

// Mock console.log to avoid test output pollution
console.log = jest.fn();

describe("GameDisplay", () => {
  let display;

  beforeEach(() => {
    display = new GameDisplay(10);
    console.log.mockClear();
  });

  describe("constructor", () => {
    test("should create display with default board size", () => {
      const defaultDisplay = new GameDisplay();
      expect(defaultDisplay.boardSize).toBe(10);
    });

    test("should create display with custom board size", () => {
      const customDisplay = new GameDisplay(8);
      expect(customDisplay.boardSize).toBe(8);
    });
  });

  describe("createHeader", () => {
    test("should create header with correct format", () => {
      const header = display.createHeader();
      expect(header).toBe("  0 1 2 3 4 5 6 7 8 9 ");
    });

    test("should create header for custom board size", () => {
      const smallDisplay = new GameDisplay(3);
      const header = smallDisplay.createHeader();
      expect(header).toBe("  0 1 2 ");
    });
  });

  describe("formatRow", () => {
    test("should format row correctly", () => {
      const grid = [
        ["~", "~", "S"],
        ["X", "O", "~"],
      ];

      const row = display.formatRow(0, grid);
      expect(row).toBe("0 ~ ~ S ");
    });
  });

  describe("message display methods", () => {
    test("should display welcome message", () => {
      display.showWelcomeMessage(3);

      expect(console.log).toHaveBeenCalledWith("\nLet's play Sea Battle!");
      expect(console.log).toHaveBeenCalledWith(
        "Try to sink the 3 enemy ships."
      );
    });

    test("should display player win message", () => {
      display.showPlayerWin();
      expect(console.log).toHaveBeenCalledWith(
        "\n*** CONGRATULATIONS! You sunk all enemy battleships! ***"
      );
    });

    test("should display player lose message", () => {
      display.showPlayerLose();
      expect(console.log).toHaveBeenCalledWith(
        "\n*** GAME OVER! The CPU sunk all your battleships! ***"
      );
    });

    test("should display CPU turn message", () => {
      display.showCPUTurn();
      expect(console.log).toHaveBeenCalledWith("\n--- CPU's Turn ---");
    });

    test("should display hit/miss messages", () => {
      display.showPlayerHit();
      expect(console.log).toHaveBeenCalledWith("PLAYER HIT!");

      display.showPlayerMiss();
      expect(console.log).toHaveBeenCalledWith("PLAYER MISS.");

      display.showCPUHit("23");
      expect(console.log).toHaveBeenCalledWith("CPU HIT at 23!");

      display.showCPUMiss("45");
      expect(console.log).toHaveBeenCalledWith("CPU MISS at 45.");
    });

    test("should display ship sunk messages", () => {
      display.showPlayerShipSunk();
      expect(console.log).toHaveBeenCalledWith("You sunk an enemy battleship!");

      display.showCPUShipSunk();
      expect(console.log).toHaveBeenCalledWith("CPU sunk your battleship!");
    });

    test("should display error messages", () => {
      display.showInvalidInput();
      expect(console.log).toHaveBeenCalledWith(
        "Oops, input must be exactly two digits (e.g., 00, 34, 98)."
      );

      display.showInvalidCoordinates(10);
      expect(console.log).toHaveBeenCalledWith(
        "Oops, please enter valid row and column numbers between 0 and 9."
      );

      display.showAlreadyGuessed();
      expect(console.log).toHaveBeenCalledWith(
        "You already guessed that location!"
      );
    });

    test("should display setup messages", () => {
      display.showShipsPlaced(3, "Player");
      expect(console.log).toHaveBeenCalledWith(
        "3 ships placed randomly for Player."
      );

      display.showBoardsCreated();
      expect(console.log).toHaveBeenCalledWith("Boards created.");
    });

    test("should display CPU target message", () => {
      display.showCPUTarget("34");
      expect(console.log).toHaveBeenCalledWith("CPU targets: 34");
    });
  });

  describe("printBoard", () => {
    test("should print board with headers and rows", () => {
      // Create mock board objects
      const mockPlayerBoard = {
        getGridDisplay: () =>
          Array(3)
            .fill(null)
            .map(() => Array(3).fill("~")),
      };
      const mockOpponentBoard = {
        getGridDisplay: () =>
          Array(3)
            .fill(null)
            .map(() => Array(3).fill("~")),
      };

      const smallDisplay = new GameDisplay(3);
      smallDisplay.printBoard(mockPlayerBoard, mockOpponentBoard);

      expect(console.log).toHaveBeenCalledWith(
        "\n   --- OPPONENT BOARD ---          --- YOUR BOARD ---"
      );
      expect(console.log).toHaveBeenCalledWith("  0 1 2        0 1 2 ");
    });
  });
});
