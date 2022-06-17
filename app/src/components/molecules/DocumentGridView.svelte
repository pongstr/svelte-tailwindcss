<script lang="ts">
  import type { DocumentModelType } from '@/types'
  import { createEventDispatcher } from 'svelte'
  import { link, push } from 'svelte-spa-router'
  import { documentStore } from '@/store'
  import { dateFromNow, focus, blurOnEsc, clipDescription } from '@/utils'
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
  <div class="collection-grid" data-location={location}>
    {#each collection as doc}
      <div
        class="collection-item"
        class:collection-item-active={doc.uid === selected}
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
          <HeroIcon icon="document-text" size={20} outline />
          <span
            class="block truncate text-sm font-medium ml-2"
            class:hide={rename.active && rename.uid === doc.uid}
          >
            <a use:link href="{path}{doc.uid}">{doc.name}</a>
          </span>
          <button class="ml-auto">
            <HeroIcon icon="information-circle" size={16} outline />
          </button>

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
        <section>
          {clipDescription(doc.description)}
        </section>
        <footer>
          <span>
            {doc.updatedAt
              ? `Updated ${dateFromNow(doc.updatedAt)}`
              : `Created ${dateFromNow(doc.createdAt)}`}</span
          >
          <span> {doc.fileCount || 0} Files</span>
        </footer>
      </div>
    {/each}
  </div>
{/if}

<style lang="postcss">
  .collection-grid {
    @apply grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 auto-rows-max gap-8 mx-10 mb-10;
  }

  .collection-item {
    @apply flex flex-col justify-between items-center p-4 border cursor-pointer rounded-lg transition-shadow;
    @apply border-gray-300 hover:shadow-lg;
    min-height: 180px;
  }

  .collection-item header,
  .collection-item footer {
    @apply w-full flex justify-between items-center;
  }

  .collection-item section,
  .collection-item footer {
    @apply text-xs;
  }

  .collection-item section {
    @apply line-clamp-3 pr-5;
  }

  .collection-item-active {
  }

  .rename-form {
    @apply hidden;
  }
</style>
