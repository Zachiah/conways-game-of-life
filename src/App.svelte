<script lang="ts">
  import { onMount } from "svelte";
  import PauseIcon from "./lib/icons/PauseIcon.svelte";
  import PlayIcon from "./lib/icons/PlayIcon.svelte";
  import ShuffleIcon from "./lib/icons/ShuffleIcon.svelte";
  import EraserIcon from "./lib/icons/EraserIcon.svelte";
  import Life from "./lib/Life";
  import nextGeneration from "./lib/nextGeneration";
  import {
    BLINKER_SHIP,
    GLIDER,
    SPACESHIP,
    spinObject90Deg,
  } from "./lib/objects";
  import ToolbarButton from "./lib/ToolbarButton.svelte";
  import ToolbarControl from "./lib/ToolbarControl.svelte";
  import NextIcon from "./lib/icons/NextIcon.svelte";

  let size = 100;
  const SCALE = 10;

  const WINDOW_RATIO = window.innerWidth / window.innerHeight;
  const r = WINDOW_RATIO;
  $: WIDTH = Math.floor(r > 1 ? size : size * r);
  $: HEIGHT = Math.floor(r > 1 ? size / r : size);
  const MAIN_COLOR = "#000";
  const OTHER_COLORS = ["#666", "#888", "#AAA", "#CCC", "#EEE", "#FFF"].reverse();

  let pastCells;
  let cells;
  $: {
    pastCells = [];
    cells = getInitialCells(WIDTH, HEIGHT);
  }

  let playing = false;
  let interval = null;

  function getInitialCells(width, height) {
    let life = new Life(width, height);
    life.useObject(spinObject90Deg(BLINKER_SHIP), 10, 10);
    life.useObject(spinObject90Deg(BLINKER_SHIP), 50, 50);
    life.useObject(GLIDER, 10, 10);

    return life.cells;
  }

  function iterate() {
    console.log(cells);
    nextGeneration(cells).then((s) => {
      // add the current cells to the past cells and make sure past cells is limited to 5
      pastCells.push(cells);
      if (pastCells.length > 5) {
        pastCells.shift();
      }
      pastCells = pastCells;
      cells = s;
      if (playing) {
        iterate();
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

  let mouseIsDown = false;

  const draw = (e: MouseEvent) => {
    const target = e.target as HTMLCanvasElement;

    const theScale = target.getBoundingClientRect().width / cells.length;
    console.log(e.target);
    console.log(theScale);

    const x = Math.floor(
      (e.clientX - target.getBoundingClientRect().left) / theScale
    );
    const y = Math.floor(
      (e.clientY - target.getBoundingClientRect().top) / theScale
    );

    console.log(x, y);
    cells[x][y] = !eraser;
    cells = cells;
  };

  let eraser = false;
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
  on:mousedown={(e) => {
    mouseIsDown = true;
    draw(e);
  }}
  on:mouseup={() => {
    mouseIsDown = false;
  }}
  on:mousemove={(e) => {
    if (mouseIsDown) {
      draw(e);
    }
  }}
/>

<div class="flex items-center justify-center absolute bottom-4 w-full">
  <div class="flex gap-2 bg-blue-400 p-1 rounded-md">
    <ToolbarButton Icon={ShuffleIcon} on:click={randomize} disabled={playing} />
    <ToolbarButton
      Icon={playing ? PauseIcon : PlayIcon}
      on:click={switchPausePlay}
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
      active={eraser}
      on:click={() => {
        eraser = !eraser;
      }}
    />
    <ToolbarButton
      Icon={NextIcon}
      on:click={() => {
        iterate();
      }}
    />
  </div>
</div>

<!--Next button-->
