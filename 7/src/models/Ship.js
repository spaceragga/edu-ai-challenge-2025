export class Ship {
  constructor(length = 3) {
    this.length = length;
    this.locations = [];
    this.hits = new Array(length).fill(false);
  }

  addLocation(location) {
    this.locations.push(location);
  }

  hit(location) {
    const index = this.locations.indexOf(location);
    if (index >= 0) {
      this.hits[index] = true;
      return true;
    }
    return false;
  }

  isHit(location) {
    const index = this.locations.indexOf(location);
    return index >= 0 && this.hits[index];
  }

  isSunk() {
    return this.hits.every((hit) => hit);
  }

  getLocations() {
    return [...this.locations];
  }
}
