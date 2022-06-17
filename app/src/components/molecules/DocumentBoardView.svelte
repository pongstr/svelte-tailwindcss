<script lang="ts">
  import type { DocumentModelType } from '@/types'
  import { createEventDispatcher } from 'svelte'
  import bytes from 'bytes'
  import { link, push } from 'svelte-spa-router'
  import { dateFromNow, dateSimple, focus, blurOnEsc } from '@/utils'
  import { documentStore } from '@/store'
  import { HeroIcon } from '../atoms'

  export let path = ''
  export let location = ''
  export let collection: Partial<DocumentModelType>[] = []
  export let rename = { active: false, uid: undefined }

  export let trigger: (
    event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement },
    content: Partial<DocumentModelType>,
  ) => void

  const dispatch = createEventDispatcher()

  $: activeSortKey = 'date'
  $: selected = $documentStore.selected || null

  function onBlur(): void {
    dispatch('rename', { active: false, uid: undefined })
  }

  function onBlurEscape(e: KeyboardEvent): void {
    if (e.code !== 'Escape') return
    dispatch('rename', { active: false, uid: undefined })
  }

  function renameDocument(doc: Partial<DocumentModelType>): void {
    documentStore.updateDocument(doc)
    dispatch('rename', { active: false, uid: undefined })
  }

  function sortName(sort: keyof DocumentModelType): void {
    activeSortKey = sort
    dispatch('sort', sort)
  }
</script>

{#if collection && collection.length > 0}
  <div class="board-view-wrapper">
    <div class="board-view-container" data-location={location}>
      <div class="board-view-list">
        {#each collection as doc}
          <div>
            {doc.name}

            <!-- <pre>{JSON.stringify(doc, null, 2)}</pre> -->
          </div>
        {/each}
      </div>
      <div class="board-view-list" />
    </div>
  </div>
{/if}

<style lang="sass">
.board-view-wrapper
  width: 100%
  max-width: 100%
  overflow-y: none
  overflow-x: auto

.board-view-container
  display: flex
  height: 100%
  flex-direction: row
  flex-wrap: nowrap
  justify-content: flex-start
  align-items: stretch
  margin: var(--spacing)
  overflow: hidden

.board-view-list
  flex-basis: 300px

  &:nth-of-type(odd)
    background-color: rgba(var(--rgb-gray-400, 1))

</style>
