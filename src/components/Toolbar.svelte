<script lang="ts">
  import ToolbarButton from "./ToolbarButton.svelte";
  import AddIcon from "./icons/AddIcon.svelte";
  import PauseIcon from "./icons/PauseIcon.svelte";
  import PlayIcon from "./icons/PlayIcon.svelte";
  import NextIcon from "./icons/NextIcon.svelte";
  import EraserIcon from "./icons/EraserIcon.svelte";
  import ShuffleIcon from "./icons/ShuffleIcon.svelte";
  import { createEventDispatcher } from "svelte";
  import ToolbarControl from "./ToolbarControl.svelte";

  export let playing: boolean;
  export let size: number;
  export let eraserToolActive: boolean;

  const dispatch = createEventDispatcher();
</script>

<div class="flex items-center justify-center absolute bottom-4 w-full">
  <div class="flex gap-2 bg-blue-400 p-1 rounded-md">
    <ToolbarButton
      Icon={ShuffleIcon}
      on:click={() => dispatch("randomize")}
      disabled={playing}
      tooltipMessage={"Fill the board with random data"}
    />
    <ToolbarButton
      Icon={AddIcon}
      on:click={() => dispatch("openObjectAdding")}
      disabled={playing}
      tooltipMessage={"Clear the board then add a new object to the board"}
    />
    <ToolbarButton
      Icon={playing ? PauseIcon : PlayIcon}
      on:click={() => dispatch("switchPausePlay")}
      tooltipMessage={playing ? "Pause" : "Play"}
    />
    <ToolbarControl
      label="Size"
      type="number"
      disabled={playing}
      value={size}
      on:input={(e) => {
        //@ts-ignore
        size = +e.target.value;
      }}
    />
    <ToolbarButton
      Icon={EraserIcon}
      active={eraserToolActive}
      on:click={() => dispatch("toggleEraserToolActive")}
      tooltipMessage={"Activate the eraser tool"}
    />
    <ToolbarButton
      tooltipMessage={"Go forward one iteration"}
      Icon={NextIcon}
      on:click={() => dispatch("iterate")}
    />
  </div>
</div>
