<script lang="ts">
  export let outline = false
  export let color = 'inherit'
  export let icon = 'photograph'
  export let size = 20
</script>

<span
  {...$$props}
  class="heroicon"
  style="color: {color}; width: {size}px; height: {size}px;"
>
  <svg style="width: {size}px; height: {size}px;">
    {#if outline}
      <use xlink:href="./img/heroicon-outline.svg#{icon}" />
    {:else}
      <use xlink:href="./img/heroicon-solid.svg#{icon}" />
    {/if}
  </svg>
</span>

<style lang="postcss" global>
  .heroicon {
    @apply inline-flex justify-center items-center align-middle;
  }
</style>
