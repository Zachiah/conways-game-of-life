<script lang="ts">
  export let playing: boolean;
  export let fps: number;
</script>

{#if playing}
  <div
    class="absolute top-4 right-4 font-mono p-2 bg-white rounded-md opacity-70 hover:opacity-100"
  >
    {fps.toFixed(0)} FPS
  </div>
{/if}
