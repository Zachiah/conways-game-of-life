<script lang="ts">
  import { onMount } from "svelte";
  import PauseIcon from "./lib/icons/PauseIcon.svelte";
  import PlayIcon from "./lib/icons/PlayIcon.svelte";
  import ShuffleIcon from "./lib/icons/ShuffleIcon.svelte";
  import Life from "./lib/Life";
  import nextGeneration from "./lib/nextGeneration";
  import ToolbarButton from "./lib/ToolbarButton.svelte";

  const SIZE = 300;
  const SCALE = 10;

  const WINDOW_RATIO = window.innerWidth / window.innerHeight;
  const r = WINDOW_RATIO;
  const WIDTH = Math.floor(r > 1 ? SIZE : SIZE * r);
  const HEIGHT = Math.floor(r > 1 ? SIZE / r : SIZE);
  const MAIN_COLOR = "#000";
  const OTHER_COLORS = ["#666", "#888", "#AAA", "#CCC", "#EEE", "#FFF"];

  let cells = getInitialCells(WIDTH, HEIGHT);
  let pastCells = [cells];

  let playing = false;
  let interval = null;

  function getInitialCells(width, height) {
    let life = new Life(width, height);
    return life.cells;
  }

  function iterate() {
    nextGeneration(cells).then((s) => {
      // add the current cells to the past cells and make sure past cells is limited to 5
      pastCells.push(cells);
      if (pastCells.length > 5) {
        pastCells.shift();
      }
      pastCells = pastCells;
      cells = s;
      if (playing) {
        play();
      }
    });
  }

  function randomize() {
    let life = new Life(WIDTH, HEIGHT);
    life.randomize();
    cells = life.cells;
  }

  function play() {
    playing = true;
    iterate();
  }

  function switchPausePlay() {
    if (playing) {
      playing = false;
    } else {
      play();
    }
  }

  let context;
  let canvas;
  $: {
    if (canvas) {
      context = canvas.getContext("2d");
    }
  }

  $: {
    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let [index, pastCellsGrid] of pastCells.entries()) {
        context.fillStyle = OTHER_COLORS.reverse()[index];
        for (let i = 0; i < cells.length; i++) {
          for (let j = 0; j < cells[i].length; j++) {
            if (pastCellsGrid[i][j]) {
              context.fillRect(i * SCALE, j * SCALE, SCALE, SCALE);
            }
          }
        }
      }

      context.fillStyle = MAIN_COLOR;
      // draw rect for each live cell
      for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
          if (cells[i][j]) {
            context.fillRect(i * SCALE, j * SCALE, SCALE, SCALE);
          }
        }
      }
    }
  }

  onMount(() => {
    return () => {
      playing = false;
    };
  });
</script>

<!-- {#each cells as row, rowIndex}
  <div class="flex">
    {#each row as cell, cellIndex}
      <div
        on:click={() => {
          cells[rowIndex][cellIndex] = !cells[rowIndex][cellIndex];
          cells = cells;
        }}
        class="w-4 h-4"
        class:bg-blue-400={cell}
        class:bg-red-400={!cell}
      />
    {/each}
  </div>
{/each} -->

<canvas
  width={WIDTH * SCALE}
  height={HEIGHT * SCALE}
  class="w-full h-full absolute"
  style="aspect-ratio: 1/1"
  bind:this={canvas}
/>

<div class="flex items-center justify-center absolute bottom-4 w-full">
  <div class="flex gap-2 bg-blue-400 p-1 rounded-md">
    <ToolbarButton Icon={ShuffleIcon} on:click={randomize} />
    <ToolbarButton
      Icon={playing ? PauseIcon : PlayIcon}
      on:click={switchPausePlay}
    />
  </div>
</div>

<!--Next button-->
