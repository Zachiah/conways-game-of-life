import { derived, Readable, writable } from "svelte/store";
import Life from "./Life";
import useWindowSize from "./useWindowSize";

const useLifeSize = (
  windowSize: ReturnType<typeof useWindowSize>,
  validSize: Readable<number>
) => {
  const windowRatio = derived(windowSize, (ws) => ws.width / ws.height);

  let lifeSize = derived([windowRatio, validSize], ([wr, vs]) => {
    console.log("recalculating lifeSize");
    return {
      width: Math.floor(wr > 1 ? vs : vs * wr),
      height: Math.floor(wr > 1 ? vs / wr : vs),
    };
  });

  return {
    subscribe: lifeSize.subscribe,
  };
};
export default useLifeSize;
