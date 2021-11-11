<script lang="ts">
    export let Icon
</script>

<button class="p-2 bg-green-400 rounded-full flex items-center justify-center" on:click>
    <svelte:component this={Icon} />
</button>