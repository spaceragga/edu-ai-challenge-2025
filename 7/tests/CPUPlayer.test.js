import { CPUPlayer } from "../src/ai/CPUPlayer.js";

describe("CPUPlayer", () => {
  let cpu;

  beforeEach(() => {
    cpu = new CPUPlayer(10);
  });

  describe("constructor", () => {
    test("should create CPU player with default board size", () => {
      const defaultCPU = new CPUPlayer();
      expect(defaultCPU.boardSize).toBe(10);
      expect(defaultCPU.mode).toBe("hunt");
      expect(defaultCPU.targetQueue).toEqual([]);
      expect(defaultCPU.guesses).toEqual(new Set());
    });

    test("should create CPU player with custom board size", () => {
      const customCPU = new CPUPlayer(5);
      expect(customCPU.boardSize).toBe(5);
    });
  });

  describe("reset", () => {
    test("should reset CPU player to initial state", () => {
      cpu.mode = "target";
      cpu.targetQueue = ["00", "01"];
      cpu.guesses.add("00");

      cpu.reset();

      expect(cpu.mode).toBe("hunt");
      expect(cpu.targetQueue).toEqual([]);
      expect(cpu.guesses).toEqual(new Set());
    });
  });

  describe("makeGuess", () => {
    test("should make a guess in hunt mode", () => {
      const guess = cpu.makeGuess();

      expect(typeof guess).toBe("string");
      expect(guess).toHaveLength(2);
      expect(cpu.guesses.has(guess)).toBe(true);
    });

    test("should not repeat guesses", () => {
      const guesses = new Set();

      for (let i = 0; i < 10; i++) {
        const guess = cpu.makeGuess();
        expect(guesses.has(guess)).toBe(false);
        guesses.add(guess);
      }
    });

    test("should use target queue when in target mode", () => {
      cpu.mode = "target";
      cpu.targetQueue = ["23", "45"];

      const guess = cpu.makeGuess();
      expect(guess).toBe("23");
      expect(cpu.targetQueue).toEqual(["45"]);
    });

    test("should switch to hunt mode when target queue is empty", () => {
      cpu.mode = "target";
      cpu.targetQueue = [];

      cpu.makeGuess();
      expect(cpu.mode).toBe("hunt");
    });

    test("should skip already guessed targets", () => {
      cpu.mode = "target";
      cpu.targetQueue = ["23", "45"];
      cpu.guesses.add("23");

      const guess = cpu.makeGuess();
      expect(guess).toBe("45");
    });
  });

  describe("getRandomGuess", () => {
    test("should return a valid guess", () => {
      const guess = cpu.getRandomGuess();

      expect(typeof guess).toBe("string");
      expect(guess).toHaveLength(2);

      const row = parseInt(guess[0]);
      const col = parseInt(guess[1]);
      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(10);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(10);
    });

    test("should find unguessed position when most positions are guessed", () => {
      // Fill most positions except one
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          if (row !== 9 || col !== 9) {
            cpu.guesses.add(`${row}${col}`);
          }
        }
      }

      const guess = cpu.getRandomGuess();
      expect(guess).toBe("99");
    });
  });

  describe("processAttackResult", () => {
    test("should switch to target mode on hit", () => {
      const result = { hit: true, sunk: false };
      cpu.processAttackResult("45", result);

      expect(cpu.mode).toBe("target");
      expect(cpu.targetQueue.length).toBeGreaterThan(0);
    });

    test("should return to hunt mode when ship is sunk", () => {
      cpu.mode = "target";
      cpu.targetQueue = ["23", "45"];

      const result = { hit: true, sunk: true };
      cpu.processAttackResult("45", result);

      expect(cpu.mode).toBe("hunt");
      expect(cpu.targetQueue).toEqual([]);
    });

    test("should return to hunt mode on miss with empty target queue", () => {
      cpu.mode = "target";
      cpu.targetQueue = [];

      const result = { hit: false, sunk: false };
      cpu.processAttackResult("45", result);

      expect(cpu.mode).toBe("hunt");
    });

    test("should stay in target mode on miss with targets remaining", () => {
      cpu.mode = "target";
      cpu.targetQueue = ["23"];

      const result = { hit: false, sunk: false };
      cpu.processAttackResult("45", result);

      expect(cpu.mode).toBe("target");
      expect(cpu.targetQueue).toEqual(["23"]);
    });
  });

  describe("addAdjacentTargets", () => {
    test("should add valid adjacent positions", () => {
      cpu.addAdjacentTargets("55");

      const expectedTargets = ["45", "65", "54", "56"];
      expectedTargets.forEach((target) => {
        expect(cpu.targetQueue).toContain(target);
      });
    });

    test("should not add positions off the board", () => {
      cpu.addAdjacentTargets("00");

      expect(cpu.targetQueue).not.toContain("-10");
      expect(cpu.targetQueue).not.toContain("0-1");
      expect(cpu.targetQueue).toContain("10");
      expect(cpu.targetQueue).toContain("01");
    });

    test("should not add already guessed positions", () => {
      cpu.guesses.add("45");
      cpu.guesses.add("65");

      cpu.addAdjacentTargets("55");

      expect(cpu.targetQueue).not.toContain("45");
      expect(cpu.targetQueue).not.toContain("65");
      expect(cpu.targetQueue).toContain("54");
      expect(cpu.targetQueue).toContain("56");
    });

    test("should not add duplicate targets", () => {
      cpu.targetQueue = ["45"];
      cpu.addAdjacentTargets("55");

      const count45 = cpu.targetQueue.filter(
        (target) => target === "45"
      ).length;
      expect(count45).toBe(1);
    });
  });

  describe("isValidPosition", () => {
    test("should return true for valid positions", () => {
      expect(cpu.isValidPosition(0, 0)).toBe(true);
      expect(cpu.isValidPosition(5, 5)).toBe(true);
      expect(cpu.isValidPosition(9, 9)).toBe(true);
    });

    test("should return false for invalid positions", () => {
      expect(cpu.isValidPosition(-1, 0)).toBe(false);
      expect(cpu.isValidPosition(0, -1)).toBe(false);
      expect(cpu.isValidPosition(10, 0)).toBe(false);
      expect(cpu.isValidPosition(0, 10)).toBe(false);
    });
  });

  describe("getMode", () => {
    test("should return current mode", () => {
      expect(cpu.getMode()).toBe("hunt");

      cpu.mode = "target";
      expect(cpu.getMode()).toBe("target");
    });
  });

  describe("getTargetQueueSize", () => {
    test("should return target queue size", () => {
      expect(cpu.getTargetQueueSize()).toBe(0);

      cpu.targetQueue = ["23", "45"];
      expect(cpu.getTargetQueueSize()).toBe(2);
    });
  });

  describe("AI behavior integration", () => {
    test("should follow complete hunt and target cycle", () => {
      // Start in hunt mode
      expect(cpu.getMode()).toBe("hunt");

      // Make a guess and hit
      const guess1 = cpu.makeGuess();
      cpu.processAttackResult(guess1, { hit: true, sunk: false });

      // Should switch to target mode
      expect(cpu.getMode()).toBe("target");
      expect(cpu.getTargetQueueSize()).toBeGreaterThan(0);

      // Make target guesses
      const guess2 = cpu.makeGuess();
      cpu.processAttackResult(guess2, { hit: true, sunk: true });

      // Should return to hunt mode
      expect(cpu.getMode()).toBe("hunt");
      expect(cpu.getTargetQueueSize()).toBe(0);
    });
  });
});
