import { onMount } from "svelte";
import { writable } from "svelte/store";
import Life from "./Life";

const useWindowSize = () => {
  const size = writable<Life.Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  onMount(() => {
    const update = () => {
      size.set({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", update);
  });

  return {
    subscribe: size.subscribe,
  };
};

export default useWindowSize;
