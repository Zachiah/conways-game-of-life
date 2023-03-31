import Life from "./Life";
import { BLINKER_SHIP, GLIDER } from "./objects";

export const MAIN_COLOR = "#000";
export const OTHER_COLORS = [
  "#666",
  "#888",
  "#AAA",
  "#CCC",
  "#EEE",
  "#FFF",
].reverse();
export const SCALE = 10;
export const DEFAULT_SIZE = 100;

export function getInitialCells(width: number, height: number): Life {
  let life = Life.createBlankFromSize({ width, height });

  const objects: [number, number, Life][] = [
    [10, 10, Life.rotate90Deg(BLINKER_SHIP)],
    [50, 50, Life.rotate90Deg(BLINKER_SHIP)],
    [60, 60, GLIDER],
  ];

  objects.forEach((objectDescription) => {
    Life.addObject({
      obj: objectDescription[2],
      life,
      offset: { x: objectDescription[0], y: objectDescription[1] },
    });
  });

  return life;
}
