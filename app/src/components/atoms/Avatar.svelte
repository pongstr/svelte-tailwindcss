<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import HeroIcon from './HeroIcon.svelte'

  export let url: string | undefined = undefined
  export let alt: string | undefined = undefined
  export let size: number = 28

  const dispatch = createEventDispatcher<{ click: EventTarget }>()
  function clickEvent(event: Event) {
    event.preventDefault()
    dispatch<'click'>('click', event.currentTarget)
  }
</script>

<span
  class="avatar"
  style="width: ${size}px; height: ${size}px;"
  on:click={clickEvent}
>
  {#if !url || url.trim() === ''}
    <HeroIcon {size} outline={true} icon="user-circle" />
  {:else}
    <img src={url} {alt} width={size} height={size} />
  {/if}
</span>

<style lang="postcss" global>
  .avatar {
    @apply inline-block cursor-pointer align-middle;
  }

  .avatar + * {
    @apply mx-2;
  }

  .avatar img {
    @apply rounded-full;
  }
</style>
