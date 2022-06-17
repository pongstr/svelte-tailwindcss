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
  <div class="list-view-header-container">
    <div class="list-view__header">
      <section class="section section--header">
        <small>Snippet Name</small>
      </section>
      <section class="section section--files">
        <small
          class:active={activeSortKey === 'fileCount'}
          on:click={() => sortName('fileCount')}>Files</small
        >
      </section>
      <section class="section section--files">
        <small
          class:active={activeSortKey === 'size'}
          on:click={() => sortName('size')}>Size</small
        >
      </section>
      <section class="section section--date text-right">
        <small
          class:active={activeSortKey === 'updatedAt'}
          on:click={() => sortName('updatedAt')}>Last Updated</small
        >
      </section>
      <section class="section section--date text-right">
        <small
          class:active={activeSortKey === 'createdAt'}
          on:click={() => sortName('createdAt')}>Date Created</small
        >
      </section>
    </div>
  </div>
  <div class="list-view-container" data-location={location}>
    {#each collection as doc}
      <div
        class="list-view__item"
        class:list-view__item--active={doc.uid === selected}
        on:contextmenu|preventDefault={(e) => trigger(e, doc)}
        on:click={() => {
          if (rename.active && rename.uid !== undefined) {
            return
          }
          documentStore.selectDocument(doc.uid)
        }}
        on:dblclick|preventDefault={() => {
          if (rename.active && rename.uid !== undefined) {
            return
          }
          push(`${path}${doc.uid}`)
        }}
      >
        <header>
          <HeroIcon icon="document-text" size={20} />
          <h5 class:hide={rename.active && rename.uid === doc.uid}>
            <a use:link href="{path}{doc.uid}">{doc.name}</a>
          </h5>
          <form
            class="rename-form"
            class:show={rename.active && rename.uid === doc.uid}
            on:submit|preventDefault|stopPropagation={() => renameDocument(doc)}
          >
            <label for={doc.uid}>Rename</label>
            <input
              type="text"
              name={doc.uid}
              use:focus
              use:blurOnEsc
              on:blur={onBlur}
              on:keydown={onBlurEscape}
              bind:value={doc.name}
            />
          </form>
        </header>

        <section class="section section--files">
          <small>{doc.fileCount} Files</small>
        </section>

        <section class="section section--files">
          <small>{bytes.format(doc.size, { unitSeparator: ' ' })}</small>
        </section>

        <section class="section section__date text-right">
          <small>
            {doc.updatedAt
              ? `Updated ${dateFromNow(doc.updatedAt)}`
              : `Created ${dateFromNow(doc.createdAt)}`}
          </small>
        </section>

        <section class="section section__date text-right">
          <small>{dateSimple(doc.createdAt)}</small>
        </section>
      </div>
    {/each}
  </div>
{/if}

<style lang="sass">
:global(.theme-light)
  .list-view__item
    color: rgba(var(--rgb-gray-200), 0.75)
    background-color: rgba(var(--rgb-gray-200), 0.1)

:global(.theme-dark)
  .list-view-header-container
    background-color: var(--gray-400)

  .list-view__item
    color: rgba(var(--rgb-gray-200), 0.75)
    background-color: rgba(var(--rgb-gray-200), 0.1)

.list-view-container
  display: block
  margin-top: 0
  margin-bottom: var(--spacing)
  padding: 0 var(--spacing)

.list-view-header-container
  position: sticky
  top: 70px
  margin-left: 0
  margin-right: 0
  padding: calc(var(--spacing) / 2)

.list-view__header
  position: sticky
  top: 90px
  display: flex
  align-items: center
  justify-content: flex-end
  padding: 0 calc(var(--spacing) * 2)
  margin: 0 var(--spacing)

  .section--header,
  .section--date,
  .section--files
    font-weight: bold

.list-view__item
  display: flex
  align-items: center
  justify-content: flex-end
  padding: var(--spacing)
  margin: var(--spacing)
  cursor: pointer
  border-radius: calc(var(--border-radius) / 2)

  &,
  &:hover
    transition: box-shadow .2s cubic-bezier(0.4, 0.0, 0.6, 1)

  &:hover:not(&--active)
    box-shadow: 0 0 0 4px rgba(var(--secondary-rgb-color), 0.25)

  &--active
    box-shadow: 0 0 0 4px rgba(var(--secondary-rgb-color), 0.75)

  &--active:hover
    box-shadow: 0 0 0 4px rgba(var(--secondary-rgb-color), 0.85)

header,
.section--header
  display: flex
  align-items: center
  flex-basis: 250px
  flex-grow: 0
  flex-shrink: 0
  margin-right: auto

header h5
  margin: 0 0 0 8px
  font-size: 14px
  line-height: 1.6
  max-width: 220px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

  &.hide
    display: none

section,
.section
  flex-basis: 200px
  flex-grow: 0
  flex-shrink: 0

.section--files
  flex-basis: 75px
  text-align: center

.list-view__header section small
  cursor: pointer
  &.active
    color: var(--gray-100)

.rename-form
  display: none
  &.show
    display: block
  label
    display: none
  input
    margin: 0 calc(var(--spacing) / 2)
    height: 26px
    padding-left: 8px
    padding-right: 8px
</style>
