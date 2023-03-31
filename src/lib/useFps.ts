import { tweened } from "svelte/motion";
import { writable } from "svelte/store";

type FpsState = { last: number; current: number } | number | null;

const useFps = () => {
  let fpsState = writable<FpsState>(null);

  let fps = tweened(0);

  fpsState.subscribe(($fpsState) => {
    fps.set(
      $fpsState === null
        ? 0
        : typeof $fpsState === "number"
        ? 0
        : 1000 / ($fpsState.current - $fpsState.last)
    );
  });

  return {
    tick() {
      const current = performance.now();

      fpsState.update(($fpsState) =>
        $fpsState === null
          ? current
          : typeof $fpsState === "number"
          ? { current, last: $fpsState }
          : { current, last: $fpsState.current }
      );
    },
    subscribe: fps.subscribe,
    clear() {
      fpsState.set(null);
    },
  };
};

export default useFps;
