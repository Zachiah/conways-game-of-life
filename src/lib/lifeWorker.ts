import Life from "./Life";

let life = new Life(100, 100);
export default function lifeWorker(lifeCells: boolean[][]): boolean[][] {
  life.cells = lifeCells;
  life.width = lifeCells.length;
  life.height = lifeCells[0].length;

  life.next();

  return life.cells;
}

onmessage = (event: MessageEvent) => {
  const lifeCells = event.data;

  const result = lifeWorker(lifeCells);

  postMessage(result);
};
