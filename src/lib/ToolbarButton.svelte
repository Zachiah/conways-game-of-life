<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let Icon;
  export let disabled = false;
  export let active = false;
</script>

<button
  class="p-2 rounded-full flex items-center justify-center duration-200"
  class:bg-red-400={disabled}
  class:bg-green-400={!disabled && !active}
  class:bg-gray-400={!disabled && active}
  class:cursor-not-allowed={disabled}
  class:cursor-pointer={!disabled}
  on:click={(e) => {
    if (!disabled) {
      dispatch("click", e.detail);
    }
  }}
  {disabled}
>
  <svelte:component this={Icon} />
</button>
