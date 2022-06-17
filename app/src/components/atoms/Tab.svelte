<script lang="ts">
  import type { Writable } from 'svelte/store'
  import { createEventDispatcher, getContext } from 'svelte'
  import { getEventsAction } from '@/utils'
  import HeroIcon from './HeroIcon.svelte'

  export let tabid!: string
  export let tabEditor = false

  const events = getEventsAction()
  const activeTab = getContext<Writable<string>>('tabs:active')
  const dispatch = createEventDispatcher()

  $: active = $activeTab === tabid

  function setActiveTab(event: MouseEvent): void {
    event.preventDefault()
    activeTab.set(tabid)

    if (tabEditor) {
      dispatch<'active'>('active', tabid)
    }
  }

  function removeTab(event: Event) {
    event.preventDefault()
    dispatch<'remove'>('remove', tabid)
  }
</script>

{#if !tabEditor}
  <span
    {...$$restProps}
    class="basic-tab"
    class:active
    use:events
    on:click|preventDefault={setActiveTab}
  >
    <slot />
  </span>
{:else}
  <span {...$$restProps} class="editor-tab" class:active>
    <span
      class="editor-tab__filename"
      use:events
      on:click|preventDefault={setActiveTab}
    >
      <slot />
    </span>
    <span class="editor-tab__button" title="Close File" on:click={removeTab}>
      <HeroIcon size={18} icon="x-circle" />
    </span>
  </span>
{/if}

<style lang="postcss" global>
  .basic-tab {
    @apply flex justify-center items-center py-1 px-4 text-center rounded;
    @apply cursor-pointer transition-colors;
  }

  .basic-tab + .basic-tab {
    @apply ml-2;
  }

  .basic-tab:hover {
    @apply bg-gray-100 dark:bg-oh-blackout/[0.75];
  }

  .basic-tab.active {
    @apply text-oh-purple bg-gray-100 dark:bg-oh-blackout;
  }

  .editor-tab {
    @apply flex items-center justify-center my-2 p-2 text-xs rounded select-none border;
    @apply cursor-pointer;

    &,
    &:hover {
      @apply transition-colors;
    }
  }

  .editor-tab.active {
    @apply bg-gray-200 dark:bg-oh-black opacity-100;
  }

  .editor-tab + .editor-tab {
    @apply ml-2;
  }
</style>
