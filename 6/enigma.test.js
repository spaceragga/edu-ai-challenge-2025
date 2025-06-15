const { Enigma, Rotor, plugboardSwap } = require("./enigma");

describe("Enigma Machine Tests", () => {
  describe("plugboardSwap function", () => {
    test("should swap letters correctly", () => {
      expect(plugboardSwap("A", [["A", "B"]])).toBe("B");
      expect(plugboardSwap("B", [["A", "B"]])).toBe("A");
      expect(plugboardSwap("C", [["A", "B"]])).toBe("C");
    });

    test("should handle multiple pairs", () => {
      const pairs = [
        ["A", "B"],
        ["C", "D"],
      ];
      expect(plugboardSwap("A", pairs)).toBe("B");
      expect(plugboardSwap("C", pairs)).toBe("D");
      expect(plugboardSwap("E", pairs)).toBe("E");
    });

    test("should handle empty pairs", () => {
      expect(plugboardSwap("A", [])).toBe("A");
    });
  });

  describe("Rotor class", () => {
    test("should initialize correctly", () => {
      const rotor = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q", 5, 10);
      expect(rotor.wiring).toBe("EKMFLGDQVZNTOWYHXUSPAIBRCJ");
      expect(rotor.notch).toBe("Q");
      expect(rotor.ringSetting).toBe(5);
      expect(rotor.position).toBe(10);
    });

    test("should step correctly", () => {
      const rotor = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q", 0, 25);
      rotor.step();
      expect(rotor.position).toBe(0); // Should wrap around
      rotor.step();
      expect(rotor.position).toBe(1);
    });

    test("should detect notch correctly", () => {
      const rotor = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q", 0, 16); // Q = position 16
      expect(rotor.atNotch()).toBe(true);
      rotor.step();
      expect(rotor.atNotch()).toBe(false);
    });

    test("should perform forward encoding correctly", () => {
      const rotor = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q", 0, 0);
      expect(rotor.forward("A")).toBe("E"); // First letter of wiring
    });

    test("should perform backward encoding correctly", () => {
      const rotor = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q", 0, 0);
      const forward = rotor.forward("A");
      expect(rotor.backward(forward)).toBe("A"); // Should reverse
    });
  });

  describe("Enigma class", () => {
    test("should initialize correctly", () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], [["A", "B"]]);
      expect(enigma.rotors).toHaveLength(3);
      expect(enigma.plugboardPairs).toEqual([["A", "B"]]);
    });

    test("should encrypt and decrypt correctly (basic)", () => {
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const plaintext = "HELLO";
      const encrypted = enigma1.process(plaintext);

      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const decrypted = enigma2.process(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test("should encrypt and decrypt with plugboard", () => {
      const enigma1 = new Enigma(
        [0, 1, 2],
        [0, 0, 0],
        [0, 0, 0],
        [
          ["A", "B"],
          ["C", "D"],
        ]
      );
      const plaintext = "ABCD";
      const encrypted = enigma1.process(plaintext);

      const enigma2 = new Enigma(
        [0, 1, 2],
        [0, 0, 0],
        [0, 0, 0],
        [
          ["A", "B"],
          ["C", "D"],
        ]
      );
      const decrypted = enigma2.process(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test("should encrypt and decrypt with ring settings", () => {
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [1, 2, 3], []);
      const plaintext = "TESTING";
      const encrypted = enigma1.process(plaintext);

      const enigma2 = new Enigma([0, 1, 2], [0, 0, 0], [1, 2, 3], []);
      const decrypted = enigma2.process(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test("should encrypt and decrypt with different rotor positions", () => {
      const enigma1 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
      const plaintext = "ENIGMA";
      const encrypted = enigma1.process(plaintext);

      const enigma2 = new Enigma([0, 1, 2], [5, 10, 15], [0, 0, 0], []);
      const decrypted = enigma2.process(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test("should step rotors correctly", () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const initialPositions = enigma.rotors.map((r) => r.position);

      enigma.stepRotors();
      const afterStep = enigma.rotors.map((r) => r.position);

      expect(afterStep[2]).toBe(initialPositions[2] + 1); // Rightmost rotor should step
    });

    test("should handle rotor stepping with notch positions", () => {
      // Test that middle rotor stepping works correctly
      const enigma = new Enigma([0, 1, 2], [0, 0, 21], [0, 0, 0], []); // Right rotor at V (notch)

      enigma.stepRotors();
      const positions = enigma.rotors.map((r) => r.position);

      expect(positions[0]).toBe(0); // Left rotor should not step yet
      expect(positions[1]).toBe(1); // Middle rotor should step due to right rotor at notch
      expect(positions[2]).toBe(22); // Right rotor steps from 21 to 22
    });

    test("should preserve non-alphabetic characters", () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const input = "HELLO, WORLD! 123";
      const output = enigma.process(input);

      expect(output).toMatch(/^[A-Z, !0-9]+$/); // Should contain original non-letters
      expect(output.includes(",")).toBe(true);
      expect(output.includes("!")).toBe(true);
      expect(output.includes("1")).toBe(true);
    });

    test("should handle lowercase input", () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const input = "hello";
      const output = enigma.process(input);

      expect(output).toMatch(/^[A-Z]+$/); // Should be uppercase
      expect(output).toHaveLength(5);
    });

    test("should produce different outputs for different settings", () => {
      const enigma1 = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
      const enigma2 = new Enigma([0, 1, 2], [1, 0, 0], [0, 0, 0], []);

      const input = "TEST";
      const output1 = enigma1.process(input);
      const output2 = enigma2.process(input);

      expect(output1).not.toBe(output2);
    });

    test("should be symmetric (encryption = decryption)", () => {
      const enigma1 = new Enigma(
        [0, 1, 2],
        [5, 10, 15],
        [1, 2, 3],
        [
          ["A", "B"],
          ["C", "D"],
        ]
      );
      const enigma2 = new Enigma(
        [0, 1, 2],
        [5, 10, 15],
        [1, 2, 3],
        [
          ["A", "B"],
          ["C", "D"],
        ]
      );

      const plaintext = "SYMMETRYTEST";
      const encrypted = enigma1.process(plaintext);
      const decrypted = enigma2.process(encrypted);

      expect(decrypted).toBe(plaintext);
    });

    test("should never encrypt a letter to itself", () => {
      const enigma = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);

      // Test all letters
      for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode(65 + i); // A-Z
        const enigmaForLetter = new Enigma([0, 1, 2], [0, 0, 0], [0, 0, 0], []);
        const encrypted = enigmaForLetter.process(letter);
        expect(encrypted).not.toBe(letter);
      }
    });
  });

  describe("Integration tests", () => {
    test("should handle complex message with all features", () => {
      const settings = {
        rotorIDs: [0, 1, 2],
        positions: [7, 14, 21],
        rings: [3, 7, 11],
        plugboard: [
          ["A", "M"],
          ["F", "I"],
          ["N", "V"],
          ["P", "S"],
          ["T", "U"],
          ["W", "Z"],
        ],
      };

      const enigma1 = new Enigma(
        settings.rotorIDs,
        settings.positions,
        settings.rings,
        settings.plugboard
      );
      const plaintext = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";
      const encrypted = enigma1.process(plaintext);

      const enigma2 = new Enigma(
        settings.rotorIDs,
        settings.positions,
        settings.rings,
        settings.plugboard
      );
      const decrypted = enigma2.process(encrypted);

      expect(decrypted).toBe(plaintext);
    });
  });
});

// Add Jest configuration if running with Jest
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    testEnvironment: "node",
  };
}
