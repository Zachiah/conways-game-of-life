import lifeWorker from "./lifeWorker?worker";

const worker = new lifeWorker();
export default function nextGeneration(cells: boolean[][]): Promise<boolean[][]> {
  worker.postMessage(cells);

  return new Promise((res) => {
    worker.onmessage = (e) => {
      res(e.data);
    };
  })
}
