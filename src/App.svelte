<script lang="ts">
  import { onMount, tick } from "svelte";
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
  import useWindowSize from "./lib/useWindowSize";
  import useLifeSize from "./lib/useLifeSize";
  import { derived, writable } from "svelte/store";
  import useLifeHistory from "./lib/useLifeHistory";
  import { drawOnCanvas } from "./lib/lifeCanvas";

  let size = writable(DEFAULT_SIZE);
  let validSize = derived(size, (s) => s || DEFAULT_SIZE);

  let fps = useFps();
  let windowSize = useWindowSize();

  const lifeSize = useLifeSize(windowSize, validSize);

  let pastCells = useLifeHistory();
  let life = writable<Life>(Life.createBlankFromSize({ height: 1, width: 1 }));

  let playing = false;

  lifeSize.subscribe(async (ls) => {
    if (playing) return;

    console.log("Resetting life");
    pastCells.reset();

    $life = Life.createBlankFromSize(ls);
  });

  async function iterate() {
    fps.tick();

    const newLife = await nextGeneration($life);
    pastCells.push($life);

    // add the current cells to the past cells and make sure past cells is limited to 5

    $life = newLife;

    if (!playing) return;

    await iterate();
  }

  function randomize() {
    $life = Life.createRandomFromSize($lifeSize);
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

  onMount(() => {
    context = canvas?.getContext("2d") ?? null;
  });

  $: if (context && canvas) {
    drawOnCanvas({ ctx: context, canvas }, $life, $pastCells);
  }

  onMount(() => {
    return () => {
      playing = false;
    };
  });

  let mouseIsDown = false;

  const draw = (e: MouseEvent) => {
    const { x, y } = getDrawCoordinates(e);

    $life[x][y] = !eraserToolActive;
  };

  const getDrawCoordinates = (e: MouseEvent): Life.Pos => {
    const target = e.target as HTMLCanvasElement;

    const theScale = target.getBoundingClientRect().width / $lifeSize.width;

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
    const newLife = Life.createBlankFromSize($lifeSize);
    Life.addObject({ obj: object, offset: { x: 10, y: 10 }, life: newLife });
    $life = newLife;

    objectAddingOpen = false;
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
  width={$lifeSize.width * SCALE}
  height={$lifeSize.height * SCALE}
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
  bind:size={$size}
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
