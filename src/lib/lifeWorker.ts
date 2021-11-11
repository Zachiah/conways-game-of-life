import Life from "./Life"

export default function lifeWorker(lifeCells: boolean[][]): boolean[][] {
    const life = new Life(lifeCells.length, lifeCells[0].length);
    life.cells = lifeCells;

    life.next();

    return life.cells;
}

onmessage = (event: MessageEvent) => {

    const lifeCells = event.data;

    const result = lifeWorker(lifeCells);

    postMessage(result);

}