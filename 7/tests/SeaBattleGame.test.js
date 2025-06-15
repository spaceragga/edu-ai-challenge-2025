import { SeaBattleGame } from "../src/game/SeaBattleGame.js";

// Mock console.log to avoid test output pollution
console.log = jest.fn();

describe("SeaBattleGame", () => {
  let game;

  beforeEach(() => {
    game = new SeaBattleGame();
    game.setTestMode(true); // Disable readline for testing
  });

  describe("constructor", () => {
    test("should create game with default configuration", () => {
      expect(game.boardSize).toBe(10);
      expect(game.numShips).toBe(3);
      expect(game.shipLength).toBe(3);
      expect(game.gameState.isGameOver).toBe(false);
      expect(game.gameState.winner).toBe(null);
    });

    test("should create game with custom configuration", () => {
      const customGame = new SeaBattleGame({
        boardSize: 8,
        numShips: 2,
        shipLength: 4,
      });

      expect(customGame.boardSize).toBe(8);
      expect(customGame.numShips).toBe(2);
      expect(customGame.shipLength).toBe(4);
    });
  });

  describe("initialize", () => {
    test("should initialize game with ships placed", async () => {
      await game.initialize();

      expect(game.playerBoard.ships).toHaveLength(game.numShips);
      expect(game.cpuBoard.ships).toHaveLength(game.numShips);
    });
  });

  describe("processPlayerGuess", () => {
    beforeEach(async () => {
      await game.initialize();
    });

    test("should return false for invalid input length", () => {
      const result = game.processPlayerGuess("1");
      expect(result).toBe(false);
    });

    test("should return false for invalid coordinates", () => {
      const result = game.processPlayerGuess("aa");
      expect(result).toBe(false);
    });

    test("should return false for out of bounds coordinates", () => {
      const result = game.processPlayerGuess("9a");
      expect(result).toBe(false);
    });

    test("should return true for valid guess", () => {
      const result = game.processPlayerGuess("00");
      expect(result).toBe(true);
    });

    test("should return false for repeated guess", () => {
      game.processPlayerGuess("00");
      const result = game.processPlayerGuess("00");
      expect(result).toBe(false);
    });

    test("should handle hit correctly", () => {
      // Place a ship at known location for testing
      const testShip = game.cpuBoard.ships[0];
      const firstLocation = testShip.getLocations()[0];

      const result = game.processPlayerGuess(firstLocation);
      expect(result).toBe(true);
    });
  });

  describe("cpuTurn", () => {
    beforeEach(async () => {
      await game.initialize();
    });

    test("should make a CPU move", () => {
      const initialGuesses = game.cpu.guesses.size;
      game.cpuTurn();

      expect(game.cpu.guesses.size).toBe(initialGuesses + 1);
    });

    test("should update player board based on CPU attack", () => {
      const initialState = game.playerBoard.getGridDisplay(true);
      game.cpuTurn();

      // Board should have changed (either hit or miss marked)
      const newState = game.playerBoard.getGridDisplay(true);
      let changed = false;

      for (let row = 0; row < game.boardSize; row++) {
        for (let col = 0; col < game.boardSize; col++) {
          if (initialState[row][col] !== newState[row][col]) {
            changed = true;
            break;
          }
        }
        if (changed) break;
      }

      expect(changed).toBe(true);
    });
  });

  describe("checkGameEnd", () => {
    beforeEach(async () => {
      await game.initialize();
    });

    test("should return false when game is ongoing", () => {
      const result = game.checkGameEnd();
      expect(result).toBe(false);
      expect(game.gameState.isGameOver).toBe(false);
    });

    test("should detect player win", () => {
      // Sink all CPU ships
      game.cpuBoard.ships.forEach((ship) => {
        ship.getLocations().forEach((location) => {
          game.cpuBoard.receiveAttack(location);
        });
      });

      const result = game.checkGameEnd();
      expect(result).toBe(true);
      expect(game.gameState.isGameOver).toBe(true);
      expect(game.gameState.winner).toBe("player");
    });

    test("should detect CPU win", () => {
      // Sink all player ships
      game.playerBoard.ships.forEach((ship) => {
        ship.getLocations().forEach((location) => {
          game.playerBoard.receiveAttack(location);
        });
      });

      const result = game.checkGameEnd();
      expect(result).toBe(true);
      expect(game.gameState.isGameOver).toBe(true);
      expect(game.gameState.winner).toBe("cpu");
    });
  });

  describe("getGameState", () => {
    test("should return game state for testing", async () => {
      await game.initialize();
      const state = game.getGameState();

      expect(state).toHaveProperty("playerBoard");
      expect(state).toHaveProperty("cpuBoard");
      expect(state).toHaveProperty("cpu");
      expect(state).toHaveProperty("gameState");
    });
  });

  describe("endGame", () => {
    beforeEach(async () => {
      await game.initialize();
    });

    test("should handle player win", () => {
      game.gameState.winner = "player";
      game.endGame();

      // Just verify it doesn't throw - actual display is mocked
      expect(game.gameState.winner).toBe("player");
    });

    test("should handle CPU win", () => {
      game.gameState.winner = "cpu";
      game.endGame();

      // Just verify it doesn't throw - actual display is mocked
      expect(game.gameState.winner).toBe("cpu");
    });
  });

  describe("integration tests", () => {
    test("should handle complete player turn cycle", async () => {
      await game.initialize();

      const initialCPUShipCount = game.cpuBoard.getActiveShips().length;
      const result = game.processPlayerGuess("00");

      expect(result).toBe(true);

      // CPU ship count should be same or less (if hit and sunk)
      const newCPUShipCount = game.cpuBoard.getActiveShips().length;
      expect(newCPUShipCount).toBeLessThanOrEqual(initialCPUShipCount);
    });

    test("should handle complete CPU turn cycle", async () => {
      await game.initialize();

      const initialPlayerShipCount = game.playerBoard.getActiveShips().length;
      game.cpuTurn();

      // Player ship count should be same or less (if hit and sunk)
      const newPlayerShipCount = game.playerBoard.getActiveShips().length;
      expect(newPlayerShipCount).toBeLessThanOrEqual(initialPlayerShipCount);
    });

    test("should maintain game state consistency", async () => {
      await game.initialize();

      // Simulate several turns
      for (let i = 0; i < 5; i++) {
        if (!game.gameState.isGameOver) {
          game.processPlayerGuess(`0${i}`);
          if (!game.checkGameEnd()) {
            game.cpuTurn();
            game.checkGameEnd();
          }
        }
      }

      // Game state should be consistent
      const state = game.getGameState();
      expect(state.playerBoard).toBeDefined();
      expect(state.cpuBoard).toBeDefined();
      expect(state.cpu).toBeDefined();
    });
  });
});
