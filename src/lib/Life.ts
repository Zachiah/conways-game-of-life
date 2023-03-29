export default class Life {
  /*This is a wrapping version of conways game of life*/
  width: number;
  height: number;
  cells: boolean[][];
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.clear();
  }

  clear() {
    this.cells = [];
    for (let x = 0; x < this.width; x++) {
      this.cells[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.cells[x][y] = false;
      }
    }
  }
  randomize() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        this.cells[x][y] = Math.random() > 0.5;
      }
    }
  }

  useObject(obj: boolean[][], xOffset: number, yOffset: number) {
    // set cells to have the object centered in the middle of an empty grid

    if (obj.length > this.width || obj[0].length > this.height) return;

    for (let x = 0; x < obj.length; x++) {
      for (let y = 0; y < obj[0].length; y++) {
        this.setCell(x + xOffset, y + yOffset, obj[x][y]);
      }
    }
  }

  countNeighbours(x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        sum += this.getCell(x + i, y + j);
      }
    }
    sum -= this.getCell(x, y);
    return sum;
  }

  getCell(x: number, y: number): number {
    // use wrapping to get cells outside of the grid
    x = (x + this.width) % this.width;
    y = (y + this.height) % this.height;

    return this.cells[x][y] ? 1 : 0;
  }

  setCell(x: number, y: number, value: boolean | number) {
    // use wrapping to get cells outside of the grid
    x = (x + this.width) % this.width;
    y = (y + this.height) % this.height;

    this.cells[x][y] = !!value;
  }

  next() {
    // make sure to account for the wrapping
    let next = new Life(this.width, this.height);
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let neighbours = this.countNeighbours(x, y);
        if (neighbours === 3) {
          next.setCell(x, y, true);
        } else if (neighbours === 2) {
          next.setCell(x, y, this.getCell(x, y));
        }
      }
    }
    this.cells = next.cells;
  }
}
