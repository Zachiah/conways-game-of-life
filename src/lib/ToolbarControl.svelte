<script lang="ts" context="module">
  let _id = 0;
</script>

<script lang="ts">
  export let label: string;
  export let type: "text" | "number";
  export let value;

  const id = `TOOLBAR-CONTROL-${_id++}`;
</script>

<div class="flex items-center gap-1 bg-blue-300 p-2 rounded-md">
  <label for={id}>
    {label}
  </label>

  {#if type === "number"}
    <input {id} type="number" class="w-20 rounded-md px-2" bind:value />
  {:else}
    <input {id} type="text" bind:value />
  {/if}
</div>
