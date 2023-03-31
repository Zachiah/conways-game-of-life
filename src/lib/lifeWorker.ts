import Life from "./Life";

onmessage = (event: MessageEvent) => {
  postMessage(Life.getNextIteration(event.data));
};
