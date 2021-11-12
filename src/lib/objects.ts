export const spinObject90Deg = (obj: boolean[][]) => {
    const newObj = [];
    for (let i = 0; i < obj[0].length; i++) {
      newObj[i] = [];
      for (let j = 0; j < obj.length; j++) {
        newObj[i][j] = obj[obj.length - j - 1][i];
      }
    }
    return newObj;
  };

  export const getObjectFrom01String = (str: string) => {
      return str.split('\n').map(row => row.split('').map(cell => cell === '1'));
  }

export const GLIDER = [
  [false, false, true],
  [true, false, true],
  [false, true, true],
];

export const SPACESHIP = [
  [false, true, false, false, true],
  [true, false, false, false, false],
  [true, false, false, false, true],
  [true, true, true, true, false],
];

export const BLINKER_SHIP = getObjectFrom01String(
`000000000011110000000000000
000000000010001000000000000
000000000010000000000000000
011000000001001000000000000
110110000000000000000000000
011110001000000000000000000
001100010110000000010000111
000000100010000000010000101
001100010110000000010000111
011110001000000000000000000
110110000000000000000000000
011000000001001000000000000
000000000010000000000000000
000000000010001000000000000
000000000011110000000000000`
)

