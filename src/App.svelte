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
    OBJECTS,
    SPACESHIP,
    spinObject90Deg,
  } from "./lib/objects";
  import ToolbarButton from "./lib/ToolbarButton.svelte";
  import ToolbarControl from "./lib/ToolbarControl.svelte";
  import NextIcon from "./lib/icons/NextIcon.svelte";
  import AddIcon from "./lib/icons/AddIcon.svelte";
  import { tweened } from "svelte/motion";

  let size = 100;
  $: validSize = size || 100;

  let fpsState: { last: number; current: number } | number | null = null;

  let fps = tweened(0);

  $: {
    fps.set(
      fpsState === null
        ? 0
        : typeof fpsState === "number"
        ? 0
        : 1000 / (fpsState.current - fpsState.last)
    );
  }

  const SCALE = 10;

  const WINDOW_RATIO = window.innerWidth / window.innerHeight;
  const r = WINDOW_RATIO;
  $: WIDTH = Math.floor(r > 1 ? validSize : validSize * r);
  $: HEIGHT = Math.floor(r > 1 ? validSize / r : validSize);
  const MAIN_COLOR = "#000";
  const OTHER_COLORS = [
    "#666",
    "#888",
    "#AAA",
    "#CCC",
    "#EEE",
    "#FFF",
  ].reverse();

  let pastCells: boolean[][][];
  let cells: boolean[][];

  $: {
    pastCells = [];
    cells = getInitialCells(WIDTH, HEIGHT);
  }

  let playing = false;
  let interval = null;

  function getInitialCells(width: number, height: number) {
    let life = new Life(width, height);
    life.useObject(spinObject90Deg(BLINKER_SHIP), 10, 10);
    life.useObject(spinObject90Deg(BLINKER_SHIP), 50, 50);
    life.useObject(GLIDER, 10, 10);

    return life.cells;
  }

  function iterate() {
    const current = performance.now();

    fpsState =
      fpsState === null
        ? current
        : typeof fpsState === "number"
        ? { current, last: fpsState }
        : { current, last: fpsState.current };

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
      fpsState = null;
    } else {
      play();
    }
  }

  let context: CanvasRenderingContext2D | null = null;
  let canvas: HTMLCanvasElement | null = null;

  $: {
    if (canvas) {
      context = canvas.getContext("2d");
    }
  }

  $: {
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (let [index, pastCellsGrid] of pastCells.entries()) {
        context.fillStyle = OTHER_COLORS[index];
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
    const { x, y } = getDrawCoordinates(e);

    cells[x][y] = !eraser;
    cells = cells;
  };

  const getDrawCoordinates = (e: MouseEvent) => {
    const target = e.target as HTMLCanvasElement;

    const theScale = target.getBoundingClientRect().width / cells.length;
    const x = Math.floor(
      (e.clientX - target.getBoundingClientRect().left) / theScale
    );
    const y = Math.floor(
      (e.clientY - target.getBoundingClientRect().top) / theScale
    );

    return { x, y };
  };

  let eraser = false;

  let objectAddingOpen = false;

  const showObject = (object: boolean[][]) => () => {
    const game = new Life(WIDTH, HEIGHT);
    game.useObject(object, 10, 10);
    cells = game.cells;

    objectAddingOpen = false;
  };
</script>

{#if objectAddingOpen}
  <div
    class="fixed top-0 w-screen h-screen bg-gray-800 bg-opacity-40 z-40 flex items-center justify-center"
  >
    <div class="w-min-content flex flex-col gap-4">
      {#each Object.entries(OBJECTS) as [name, object]}
        <button
          class="p-2 bg-blue-200 cursor-pointer rounded-md"
          on:click={showObject(object)}
        >
          {name}
        </button>
      {/each}

      <button
        class="p-2 bg-red-200 cursor-pointer rounded-md"
        on:click={() => (objectAddingOpen = false)}
      >
        Cancel
      </button>
    </div>
  </div>
{/if}

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

{#if playing}
  <div class="absolute top-4 right-4 font-mono">
    {$fps.toFixed(0)} FPS
  </div>
{/if}

<div class="flex items-center justify-center absolute bottom-4 w-full">
  <div class="flex gap-2 bg-blue-400 p-1 rounded-md">
    <ToolbarButton
      Icon={ShuffleIcon}
      on:click={randomize}
      disabled={playing}
      tooltipMessage={"Fill the board with random data"}
    />
    <ToolbarButton
      Icon={AddIcon}
      on:click={() => {
        objectAddingOpen = true;
      }}
      disabled={playing}
      tooltipMessage={"Clear the board then add a new object to the board"}
    />
    <ToolbarButton
      Icon={playing ? PauseIcon : PlayIcon}
      on:click={switchPausePlay}
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
      active={eraser}
      on:click={() => {
        eraser = !eraser;
      }}
      tooltipMessage={"Activate the eraser tool"}
    />
    <ToolbarButton
      tooltipMessage={"Go forward one iteration"}
      Icon={NextIcon}
      on:click={() => {
        iterate();
      }}
    />
  </div>
</div>

<!--Next button-->
