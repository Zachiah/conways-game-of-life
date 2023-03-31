import Life from "./Life";
import lifeWorker from "./lifeWorker?worker";

const worker = new lifeWorker();
export default function nextGeneration(cells: Life): Promise<Life> {
  worker.postMessage(cells);

  return new Promise((res) => {
    worker.onmessage = (e) => {
      res(e.data);
    };
  });
}
