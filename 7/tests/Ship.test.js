import { Ship } from "../src/models/Ship.js";

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  describe("constructor", () => {
    test("should create ship with default length of 3", () => {
      const defaultShip = new Ship();
      expect(defaultShip.length).toBe(3);
      expect(defaultShip.locations).toEqual([]);
      expect(defaultShip.hits).toEqual([false, false, false]);
    });

    test("should create ship with specified length", () => {
      const customShip = new Ship(4);
      expect(customShip.length).toBe(4);
      expect(customShip.hits).toEqual([false, false, false, false]);
    });
  });

  describe("addLocation", () => {
    test("should add location to ship", () => {
      ship.addLocation("00");
      ship.addLocation("01");
      expect(ship.locations).toEqual(["00", "01"]);
    });
  });

  describe("hit", () => {
    beforeEach(() => {
      ship.addLocation("00");
      ship.addLocation("01");
      ship.addLocation("02");
    });

    test("should return true and mark hit when location is valid", () => {
      const result = ship.hit("00");
      expect(result).toBe(true);
      expect(ship.hits[0]).toBe(true);
    });

    test("should return false when location is not on ship", () => {
      const result = ship.hit("99");
      expect(result).toBe(false);
      expect(ship.hits).toEqual([false, false, false]);
    });

    test("should handle multiple hits on same ship", () => {
      ship.hit("00");
      ship.hit("01");
      expect(ship.hits[0]).toBe(true);
      expect(ship.hits[1]).toBe(true);
      expect(ship.hits[2]).toBe(false);
    });
  });

  describe("isHit", () => {
    beforeEach(() => {
      ship.addLocation("00");
      ship.addLocation("01");
      ship.addLocation("02");
    });

    test("should return true for hit location", () => {
      ship.hit("00");
      expect(ship.isHit("00")).toBe(true);
    });

    test("should return false for unhit location on ship", () => {
      expect(ship.isHit("00")).toBe(false);
    });

    test("should return false for location not on ship", () => {
      expect(ship.isHit("99")).toBe(false);
    });
  });

  describe("isSunk", () => {
    beforeEach(() => {
      ship.addLocation("00");
      ship.addLocation("01");
      ship.addLocation("02");
    });

    test("should return false when ship is not hit", () => {
      expect(ship.isSunk()).toBe(false);
    });

    test("should return false when ship is partially hit", () => {
      ship.hit("00");
      ship.hit("01");
      expect(ship.isSunk()).toBe(false);
    });

    test("should return true when all locations are hit", () => {
      ship.hit("00");
      ship.hit("01");
      ship.hit("02");
      expect(ship.isSunk()).toBe(true);
    });
  });

  describe("getLocations", () => {
    test("should return copy of locations array", () => {
      ship.addLocation("00");
      ship.addLocation("01");
      const locations = ship.getLocations();

      expect(locations).toEqual(["00", "01"]);

      // Modify returned array - should not affect original
      locations.push("02");
      expect(ship.locations).toEqual(["00", "01"]);
    });
  });
});
