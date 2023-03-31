namespace Life {
  export type Size = { width: number; height: number };
  export type Pos = { x: number; y: number };
  export type Cell = boolean;

  export const normalizePos = (life: Life, pos: Pos): Pos => {
    const size = getSize(life);

    return {
      x: (pos.x + size.width) % size.width,
      y: (pos.y + size.height) % size.height,
    };
  };

  export const getCell = (life: Life, pos: Pos): Cell => {
    const normalizedPos = normalizePos(life, pos);

    return life[normalizedPos.x][normalizedPos.y];
  };

  export const mutateCell = (life: Life, pos: Pos, value: Cell): void => {
    const normalizedPos = normalizePos(life, pos);

    life[normalizedPos.x][normalizedPos.y] = value;
  };

  export const getSize = (life: Life): Size => ({
    width: life.length,
    height: life[0].length,
  });

  export const createBlankFromSize = ({ width, height }: Size) => {
    const life: Life = [];
    for (let x = 0; x < width; x++) {
      life[x] = [];
      for (let y = 0; y < height; y++) {
        life[x][y] = false;
      }
    }

    return life;
  };

  export const createRandomFromSize = ({ width, height }: Size) => {
    const life: Life = [];

    for (let x = 0; x < width; x++) {
      const row = [];
      for (let y = 0; y < height; y++) {
        row.push(Math.random() > 0.5);
      }

      life.push(row);
    }

    console.log(life);

    return life;
  };

  /** Mutates {life} by adding {obj} at {offset} */
  export const addObject = ({
    obj,
    offset: { x: xOffset, y: yOffset },
    life,
  }: {
    obj: Life;
    offset: Pos;
    life: Life;
  }) => {
    const objSize = getSize(obj);
    const lifeSize = getSize(life);
    // set cells to have the object centered in the middle of an empty grid

    if (objSize.width > lifeSize.width || obj[0].length > lifeSize.height)
      return;

    for (let x = 0; x < objSize.width; x++) {
      for (let y = 0; y < objSize.height; y++) {
        mutateCell(
          life,
          { x: x + xOffset, y: y + yOffset },
          getCell(obj, { x, y })
        );
      }
    }
  };

  export const countNeighbors = (life: Life, pos: Pos) => {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        sum += getCell(life, { x: pos.x + i, y: pos.y + j }) ? 1 : 0;
      }
    }
    sum -= getCell(life, pos) ? 1 : 0;

    return sum;
  };

  export const getNextIteration = (life: Life) => {
    const size = getSize(life);
    let next = createBlankFromSize(size);

    for (let x = 0; x < size.width; x++) {
      for (let y = 0; y < size.height; y++) {
        const pos = { x, y };
        let neighbors = countNeighbors(life, pos);

        if (neighbors === 3) {
          mutateCell(next, pos, true);
        } else if (neighbors === 2) {
          mutateCell(next, pos, getCell(life, pos));
        }
      }
    }

    return next;
  };

  export const rotate90Deg = (obj: boolean[][]) => {
    const newObj: Life = [];
    for (let i = 0; i < obj[0].length; i++) {
      newObj[i] = [];
      for (let j = 0; j < obj.length; j++) {
        newObj[i][j] = obj[obj.length - j - 1][i];
      }
    }
    return newObj;
  };

  export const createFrom01String = (str: string) => {
    return str
      .split("\n")
      .map((row) => row.split("").map((cell) => cell === "1"));
  };

  export const forEach = (life: Life, cb: (pos: Pos, cell: Cell) => void) => {
    for (let x = 0; x < life.length; x++) {
      for (let y = 0; y < life.length; y++) {
        cb({x,y},life[x][y])
      }
    }
  };
}

type Life = Life.Cell[][];

export { Life as default };
