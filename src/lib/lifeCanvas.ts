import { MAIN_COLOR, OTHER_COLORS, SCALE } from "./config";
import Life from "./Life";

export type CanvasInfo = {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
};

export const clearCanvas = ({ ctx, canvas }: CanvasInfo) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

export const drawHistory = ({ ctx, canvas }: CanvasInfo, pastCells: Life[]) => {
  for (let [index, pastCellsGrid] of pastCells.entries()) {
    drawCells(
      { ctx, canvas },
      pastCellsGrid,
      OTHER_COLORS[index + (OTHER_COLORS.length - pastCells.length)]
    );
  }
};

export const drawCells = ({ ctx }: CanvasInfo, cells: Life, color: string) => {
  ctx.fillStyle = color;
  Life.forEach(cells, ({ x, y }, cell) => {
    if (cell) {
      ctx!.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  });
};

export const drawOnCanvas = (
  { ctx, canvas }: CanvasInfo,
  cells: Life,
  pastCells: Life[]
) => {
  clearCanvas({ ctx, canvas });
  drawHistory({ ctx, canvas }, pastCells);
  drawCells({ ctx, canvas }, cells, MAIN_COLOR);
};
