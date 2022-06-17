<script lang="ts">
  import { documentStore } from '@/store'
  import { HeroIcon, Tab, Tabs } from '../atoms'
  // import ButtonIcon from '../atoms/ButtonIcon.svelte'
  // import HeroIcon from '../atoms/HeroIcon.svelte'

  $: cached = $documentStore.cached
  $: activeTab = $documentStore.cached.active || ''

  function setActiveTab(event: CustomEvent<string>): void {
    if (!cached) return
    documentStore.updateDocumentCache($documentStore.current.uid, {
      ...cached,
      active: event.detail,
    })
  }

  function removeTab(event: CustomEvent<string>): void {
    if (!cached) return

    let active = cached.active || ''
    const name = event.detail
    const editors = [...cached.editors]
    const getNameIndex = editors.findIndex((item: string) => item === name)

    editors.splice(getNameIndex, 1)

    if (active === name) {
      active = editors.length > 0 ? editors[editors.length - 1] : ''
      documentStore.updateDocumentCache($documentStore.current.uid, {
        active,
        editors,
      })
      return
    }

    if (getNameIndex === editors.length - 1) {
      active = editors[editors.length - 1]
    }

    documentStore.updateDocumentCache($documentStore.current.uid, {
      active,
      editors,
    })
  }
</script>

<div class="tab-component-wrapper">
  <button class="posleft">
    <HeroIcon outline icon="chevron-double-left" size={14} />
  </button>
  <button class="posright">
    <HeroIcon outline icon="chevron-double-right" size={14} />
  </button>
  <div class="tab-container">
    {#if cached}
      {#key activeTab}
        <Tabs bind:active={activeTab}>
          {#each cached.editors as snippet}
            <Tab
              tabEditor
              tabid={snippet}
              on:active={setActiveTab}
              on:remove={removeTab}
            >
              <HeroIcon outline size={16} icon="document-text" />
              <span>{snippet}</span>
            </Tab>
          {/each}
        </Tabs>
      {/key}
    {/if}
  </div>
</div>

<style lang="sass">
.tab-component-wrapper
  position: absolute
  top: 0
  left: var(--spacing)
  right: var(--spacing)
  padding-top: 2px

button
  position: absolute
  top: 2px
  z-index: 101
  width: 30px
  height: 30px
  color: var(--white)
  border: transparent
  background-color: var(--black)

button.posleft
  left: -2px

button.posright
  right: 0

.tab-container
  position: relative
  z-index: 100
  white-space: nowrap
  overflow: hidden
</style>
