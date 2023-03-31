import { writable } from "svelte/store";
import { MAX_HISTORY } from "./config";
import Life from "./Life";

const useLifeHistory = () => {
  let history = writable<Life[]>();

  return {
    subscribe: history.subscribe,
    reset() {
      history.set([]);
    },
    push: (life: Life) => {
      history.update(($history) => {
        $history.push(life);
        if ($history.length > MAX_HISTORY) {
          $history.shift();
        }

        return $history;
      });
    },
  };
};

export default useLifeHistory;
