<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import HeroIcon from './HeroIcon.svelte'

  export let float = false
  export let outline = false
  export let icon = 'photograph'
  export let color = 'inherit'
  export let variant = 'default'
  export let size: 'default' | 'large' | 'small' | number = 'default'
  export let type: 'button' | 'submit' = 'button'

  const dispatch = createEventDispatcher<{ click: EventTarget }>()

  function clickEvent(event: Event): void {
    event.preventDefault()
    dispatch<'click'>('click', event.currentTarget)
  }
</script>

<button
  {type}
  {...$$props}
  class="btn-icon btn-{variant} {float ? ' btn-float' : ''} btn-size-{size}"
  on:click={clickEvent}
>
  {#if typeof size === 'number'}
    <HeroIcon {outline} {icon} {size} {color} />
  {:else if size === 'large'}
    <HeroIcon {outline} {icon} size={30} {color} />
  {:else if size === 'small'}
    <HeroIcon {outline} {icon} size={18} {color} />
  {:else}
    <HeroIcon {outline} {icon} size={24} {color} />
  {/if}
</button>

<style lang="postcss" global>
  .btn-icon {
    @apply inline-flex justify-center items-center p-1 rounded-full transition-colors;
    @apply hover:bg-oh-gray-200/[0.55] dark:hover:bg-oh-gray-500/[0.25];
  }

  .btn-icon ~ * {
    @apply ml-1;
  }

  .btn-float {
    @apply p-1 border-none bg-transparent rounded;
    @apply hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500/[0.25];
  }
</style>
