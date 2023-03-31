<script lang="ts">
  import { onMount } from "svelte";
  import Life from "./lib/Life";
  import nextGeneration from "./lib/nextGeneration";

  import FpsIndicator from "./components/FpsIndicator.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import AddObjectDialog from "./components/AddObjectDialog.svelte";
  import useFps from "./lib/useFps";

  import {
    SCALE,
    MAIN_COLOR,
    OTHER_COLORS,
    DEFAULT_SIZE,
    getInitialCells,
  } from "./lib/config";

  let size = DEFAULT_SIZE;
  $: validSize = size || DEFAULT_SIZE;

  let fps = useFps();

  const WINDOW_RATIO = window.innerWidth / window.innerHeight;
  const r = WINDOW_RATIO;
  $: WIDTH = Math.floor(r > 1 ? validSize : validSize * r);
  $: HEIGHT = Math.floor(r > 1 ? validSize / r : validSize);

  let pastCells: boolean[][][];
  let life: Life;

  $: {
    console.log("Resetting life");
    pastCells = [];
    life = getInitialCells(WIDTH, HEIGHT);
  }

  let playing = false;

  async function iterate() {
    fps.tick();

    const newLife = await nextGeneration(life);

    // add the current cells to the past cells and make sure past cells is limited to 5
    pastCells.push(life);
    if (pastCells.length > 5) {
      pastCells.shift();
    }
    pastCells = pastCells;
    life = newLife;

    if (!playing) return;

    await iterate();
  }

  function randomize() {
    life = Life.createRandomFromSize({ width: WIDTH, height: HEIGHT });
  }

  function play() {
    playing = true;
    iterate();
  }

  function switchPausePlay() {
    if (playing) {
      playing = false;
      fps.clear();
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
        for (let i = 0; i < life.length; i++) {
          for (let j = 0; j < life[i].length; j++) {
            if (pastCellsGrid[i][j]) {
              context.fillRect(i * SCALE, j * SCALE, SCALE, SCALE);
            }
          }
        }
      }

      context.fillStyle = MAIN_COLOR;
      // draw rect for each live cell
      for (let i = 0; i < life.length; i++) {
        for (let j = 0; j < life[i].length; j++) {
          if (life[i][j]) {
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

    life[x][y] = !eraserToolActive;
    life = life;
  };

  const getDrawCoordinates = (e: MouseEvent) => {
    const target = e.target as HTMLCanvasElement;

    const theScale = target.getBoundingClientRect().width / life.length;
    const x = Math.floor(
      (e.clientX - target.getBoundingClientRect().left) / theScale
    );
    const y = Math.floor(
      (e.clientY - target.getBoundingClientRect().top) / theScale
    );

    return { x, y };
  };

  let eraserToolActive = false;

  let objectAddingOpen = false;

  const showObject = (object: Life) => {
    console.log("ShowObject");
    const newLife = Life.createBlankFromSize({ width: WIDTH, height: HEIGHT });
    Life.addObject({ obj: object, offset: { x: 10, y: 10 }, life: newLife });
    life = newLife;

    objectAddingOpen = false;

    console.log("ShowObject Finished");
  };
</script>

<AddObjectDialog
  open={objectAddingOpen}
  on:close={() => {
    objectAddingOpen = false;
  }}
  on:showObject={(e) => {
    console.log("Calling Show Object");
    showObject(e.detail);
  }}
/>

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

<FpsIndicator {playing} fps={$fps} />
<Toolbar
  bind:size
  {playing}
  {eraserToolActive}
  on:randomize={randomize}
  on:switchPausePlay={switchPausePlay}
  on:toggleEraserToolActive={() => {
    eraserToolActive = !eraserToolActive;
  }}
  on:iterate={iterate}
  on:openObjectAdding={() => (objectAddingOpen = true)}
/>

<!--Next button-->
