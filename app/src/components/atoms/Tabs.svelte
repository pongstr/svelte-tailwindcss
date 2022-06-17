<script lang="ts">
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { getEventsAction } from '@/utils'

  export let active = ''
  export let full = false
  export let tabEditor = false

  const events = getEventsAction()
  const activeTab = writable<string>(active)

  let num = 0

  setContext('tabs:getid', { incr: (): number => num++ })
  setContext('tabs:active', activeTab)

  $: active = $activeTab
</script>

<nav
  class:tabs={1}
  class:is-full={full}
  use:events
  {...$$restProps}
  class:tab-editor={tabEditor}
>
  <slot />
</nav>

<style lang="postcss">
  nav {
    @apply flex justify-start items-center mt-6 mb-8;
  }
</style>
