<script lang="ts">
  import { createEventDispatcher, SvelteComponent } from "svelte";
  import tooltip from "../lib/tooltip";

  const dispatch = createEventDispatcher();

  export let Icon: new (props: unknown) => SvelteComponent;
  export let disabled = false;
  export let active = false;
  export let tooltipMessage: string;
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
  use:tooltip={{ content: tooltipMessage }}
>
  <svelte:component this={Icon} />
</button>
