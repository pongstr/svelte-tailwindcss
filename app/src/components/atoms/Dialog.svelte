<script lang="ts">
  import { fade } from 'svelte/transition'
  import { createEventDispatcher } from 'svelte'
  import { getEventsAction } from '../../utils'
  import ButtonIcon from './ButtonIcon.svelte'

  export let open = false
  export let options = {}

  const dispatch = createEventDispatcher()
  const events = getEventsAction()
  const opts = {
    name: '',
    width: '400px',
    close: true,
    static: false,
    keyboard: true,
    ...options,
  }

  function toggleModal(event: Event) {
    event.preventDefault()

    if (!opts.static) {
      open = false
    }
  }

  function close(event: Event): void {
    event.preventDefault()
    open = false
    dispatch('close', { ...options })
  }

  document.addEventListener('keydown', (event: KeyboardEvent): void => {
    if (opts.keyboard && event.key === 'Escape') {
      open = false
    }
  })

  function onEscape(event: KeyboardEvent): void {
    if (opts.keyboard && event.key === 'Escape') {
      open = false
      dispatch('escape', { ...options })
    }
  }
</script>

<svelte:body on:keyup={onEscape} />

{#if open}
  <div class="dialog-container" transition:fade={{ duration: 100 }}>
    <div class="dialog-background" on:click={toggleModal} />
    <div
      class:dialog-content={1}
      use:events
      {...$$restProps}
      style="width: {opts.width}"
    >
      <slot />
      <span class="button--close">
        <ButtonIcon
          float
          on:click={close}
          icon="x"
          outline={true}
          size="small"
        />
      </span>
    </div>
  </div>
{/if}

<style lang="sass">
.dialog-container
  position: fixed
  top: 0
  left: 0
  z-index: 10000
  width: 100vw
  height: 100vh
  z-index: 10000
  box-shadow: 0 -1px 50px 0 rgba(var(--rgb-blackout), 0.5)

.dialog-background
  position: fixed
  top: 0
  left: 0
  width: 100vw
  height: 100vh
  background-color: rgba(var(--rgb-blackout), 1)
  opacity: 0.5

.dialog-content
  position: fixed
  top: 50%
  left: 50%
  min-width: 400px
  // max-width: 85%
  padding: calc(var(--spacing) * 2) var(--spacing)
  transform: translate(-50%, -50%)
  border-radius: calc(var(--border-radius) / 2)
  background-color: var(--gray-400)


.button--close
  position: absolute
  top: calc(var(--spacing) / 2)
  right: calc(var(--spacing) / 2)
  opacity: 0.25
  transition: opacity .2s ease, color .2s ease

  &:hover
    opacity: 1
    color: var(--warning-color)
    transition: opacity .2s ease, color .2s ease
</style>
