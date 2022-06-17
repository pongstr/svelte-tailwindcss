<script lang="ts">
  import { setContext, createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'

  export let x: number
  export let y: number

  const dispatch = createEventDispatcher()
  let contextMenu!: HTMLDivElement

  $: ((cx, cy) => {
    if (!contextMenu) return

    const rect = contextMenu.getBoundingClientRect()
    cx = Math.min(window.innerWidth - rect.width, cx)

    if (cy > window.innerHeight - rect.height) {
      cy -= rect.height
    }
  })(x, y)

  setContext('context:menu', {
    dispatchClick: () => dispatch('click'),
  })

  function onPageClick(event: MouseEvent): void {
    const target = event.target as HTMLDivElement

    if (event.target === contextMenu || contextMenu.contains(target)) {
      return
    }

    dispatch('clickoutside')
  }
</script>

<svelte:body on:click={onPageClick} />
<div
  class="context-menu"
  style="z-index: 10000; top: {y}px; left: {x}px;"
  bind:this={contextMenu}
  transition:fade={{ duration: 100 }}
>
  <slot />
</div>
