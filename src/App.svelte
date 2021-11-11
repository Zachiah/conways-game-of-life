<script lang="ts">
  import { onMount } from "svelte";

  const SCALE = 10;

  import Life from "./lib/Life";

  import nextGeneration from "./lib/nextGeneration";

  let life = new Life(200, 400);
  life.randomize();

  const MAIN_COLOR = "#000";
  const OTHER_COLORS = ["#666", "#888", "#AAA", "#CCC", "#EEE", "#FFF"]

  let cells = life.cells;
  let pastCells = [cells];

  let playing = false;
  let interval = null;

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

  function play() {
    playing = true;
    iterate();
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
      const scale = life.height < life.width ?  canvas.width / life.width : canvas.height / life.height;

      context.clearRect(0, 0, canvas.width, canvas.height);


      for (let [index, pastCellsGrid] of pastCells.entries()) {
        context.fillStyle = OTHER_COLORS.reverse()[
          index
        ];
        for (let i = 0; i < cells.length; i++) {
          for (let j = 0; j < cells[i].length; j++) {
            if (
              pastCellsGrid[i][j]
            ) {
              context.fillRect(i * scale, j * scale, scale, scale);
            }
          }
        }
      }


      context.fillStyle = MAIN_COLOR;
      // draw rect for each live cell
      for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
          if (cells[i][j]) {
            context.fillRect(i * scale, j * scale, scale, scale);
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
  width="1000"
  height="1000"
  class="w-[80vmin] m-auto mt-4"
  style="aspect-ratio: 1/1"
  bind:this={canvas}
/>

<button
  class="p-4 bg-green-400 text-white mt-8 w-full"
  on:click={async () => {
    if (playing) {
      playing = false;
    } else {
      play();
    }
  }}
>
  {playing ? "Stop" : "Play"}
</button>

<button
  class="p-4 bg-red-400 text-white mt-8 w-full"
  on:click={() => {
    life = new Life(100, 100);
    life.randomize();
    cells = life.cells;
    pastCells = [cells];
  }}
>
  Randomize
</button>

<!--Next button-->
<button
  class="p-4 bg-blue-400 text-white mt-8 w-full"
  on:click={iterate}
>
  Next
</button>
