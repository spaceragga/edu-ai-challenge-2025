import { Board } from "../models/Board.js";
import { CPUPlayer } from "../ai/CPUPlayer.js";
import { GameDisplay } from "../ui/GameDisplay.js";
import readline from "readline";

export class SeaBattleGame {
  constructor(config = {}) {
    this.boardSize = config.boardSize || 10;
    this.numShips = config.numShips || 3;
    this.shipLength = config.shipLength || 3;

    this.playerBoard = new Board(this.boardSize);
    this.cpuBoard = new Board(this.boardSize);
    this.cpu = new CPUPlayer(this.boardSize);
    this.display = new GameDisplay(this.boardSize);

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.gameState = {
      isGameOver: false,
      winner: null,
    };
  }

  async initialize() {
    this.display.showBoardsCreated();

    // Place ships randomly for both players
    this.playerBoard.placeShipsRandomly(this.numShips, this.shipLength);
    this.display.showShipsPlaced(this.numShips, "Player");

    this.cpuBoard.placeShipsRandomly(this.numShips, this.shipLength);
    this.display.showShipsPlaced(this.numShips, "CPU");

    this.display.showWelcomeMessage(this.numShips);
  }

  async start() {
    await this.initialize();
    await this.gameLoop();
  }

  async gameLoop() {
    while (!this.gameState.isGameOver) {
      if (this.checkGameEnd()) {
        break;
      }

      this.display.printBoard(this.playerBoard, this.cpuBoard);

      const playerMadeValidGuess = await this.playerTurn();

      if (playerMadeValidGuess) {
        if (this.checkGameEnd()) {
          break;
        }

        this.cpuTurn();

        if (this.checkGameEnd()) {
          break;
        }
      }
    }

    this.endGame();
  }

  async playerTurn() {
    return new Promise((resolve) => {
      this.rl.question("Enter your guess (e.g., 00): ", (answer) => {
        const result = this.processPlayerGuess(answer);
        resolve(result);
      });
    });
  }

  processPlayerGuess(guess) {
    try {
      if (!guess || guess.length !== 2) {
        this.display.showInvalidInput();
        return false;
      }

      // Validate and parse the guess
      this.cpuBoard.parseLocation(guess);

      const attackResult = this.cpuBoard.receiveAttack(guess);

      if (attackResult.result === "already_guessed") {
        this.display.showAlreadyGuessed();
        return false;
      }

      if (attackResult.hit) {
        this.display.showPlayerHit();
        if (attackResult.sunk) {
          this.display.showPlayerShipSunk();
        }
      } else {
        this.display.showPlayerMiss();
      }

      return true;
    } catch (error) {
      if (error.message.includes("Invalid location")) {
        this.display.showInvalidCoordinates(this.boardSize);
      } else {
        this.display.showInvalidInput();
      }
      return false;
    }
  }

  cpuTurn() {
    this.display.showCPUTurn();

    const guess = this.cpu.makeGuess();

    if (this.cpu.getMode() === "target") {
      this.display.showCPUTarget(guess);
    }

    const attackResult = this.playerBoard.receiveAttack(guess);
    this.cpu.processAttackResult(guess, attackResult);

    if (attackResult.hit) {
      this.display.showCPUHit(guess);
      if (attackResult.sunk) {
        this.display.showCPUShipSunk();
      }
    } else {
      this.display.showCPUMiss(guess);
    }
  }

  checkGameEnd() {
    if (this.cpuBoard.getAllSunk()) {
      this.gameState.isGameOver = true;
      this.gameState.winner = "player";
      return true;
    }

    if (this.playerBoard.getAllSunk()) {
      this.gameState.isGameOver = true;
      this.gameState.winner = "cpu";
      return true;
    }

    return false;
  }

  endGame() {
    if (this.gameState.winner === "player") {
      this.display.showPlayerWin();
    } else {
      this.display.showPlayerLose();
    }

    this.display.printBoard(this.playerBoard, this.cpuBoard);
    this.rl.close();
  }

  // For testing purposes
  getGameState() {
    return {
      playerBoard: this.playerBoard,
      cpuBoard: this.cpuBoard,
      cpu: this.cpu,
      gameState: this.gameState,
    };
  }

  // For testing purposes
  setTestMode(testMode = true) {
    if (testMode) {
      this.rl.close();
      this.rl = {
        question: () => {},
        close: () => {},
      };
    }
  }
}
