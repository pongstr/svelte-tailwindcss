<script lang="ts">
  import { fade } from 'svelte/transition'

  export let overflow = true
</script>

<div
  class="main bg-white dark:bg-oh-black"
  in:fade={{ duration: 400, delay: 200 }}
>
  <slot name="toolbar" />
  <div class="page-content-container" class:overflow>
    <slot />
  </div>
</div>

<style lang="postcss">
  .main {
    @apply relative basis-full flex-grow flex-shrink overflow-hidden;
  }

  .page-content-container {
    @apply relative w-full h-full max-h-full;
  }

  .overflow {
    @apply overflow-y-auto;
  }

  @media screen and (max-width: 990px) {
    .page-content-container {
      min-width: 1000px;
    }
  }
</style>
