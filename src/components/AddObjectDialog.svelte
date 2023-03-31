<script lang="ts">
  import { OBJECTS } from "../lib/objects";
  import { createEventDispatcher } from "svelte";

  export let open: boolean;

  const dispatch = createEventDispatcher();
</script>

{#if open}
  <div
    class="fixed top-0 w-screen h-screen bg-gray-800 bg-opacity-40 z-40 flex items-center justify-center"
  >
    <div class="w-min-content flex flex-col gap-4">
      {#each Object.entries(OBJECTS) as [name, object]}
        <button
          class="p-2 bg-blue-200 cursor-pointer rounded-md"
          on:click={() => dispatch("showObject", object)}
        >
          {name}
        </button>
      {/each}

      <button
        class="p-2 bg-red-200 cursor-pointer rounded-md"
        on:click={() => dispatch("close")}
      >
        Cancel
      </button>
    </div>
  </div>
{/if}
