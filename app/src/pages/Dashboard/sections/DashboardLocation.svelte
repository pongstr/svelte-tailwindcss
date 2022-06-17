<script lang="ts">
  import type { ContextMenuOptions, DocumentModelType } from '@/types'
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import {
    Icon,
    ViewGrid,
    ViewList,
    ViewBoards,
    SortAscending,
    SortDescending,
    Tag,
    Plus,
    Upload,
  } from 'svelte-hero-icons'
  import {
    BlankSlate,
    Button,
    ButtonIcon,
    HeroIcon,
    Dialog,
    DocumentBoardView,
    DocumentGridView,
    DocumentContextMenu,
    DocumentInfo,
    DocumentListView,
    FuzzySearch,
  } from '@/components'
  import { documentStore, workspaceStore } from '@/store'
  import DashboardToolbar from '@/components/DashboardTemplate/DashboardToolbar.svelte'

  export let workspaceId = ''
  export let title = ''
  export let params: Record<'location', string> = {
    location: '',
  }

  const path = ['', workspaceId, params.location, ''].join('/')

  $: workspace = $workspaceStore.current || null
  $: content = null
  $: showMenu = false
  $: showSearch = false
  $: showInfo = false
  $: position = { x: 0, y: 0 }
  $: sortKey = 'createdAt'
  $: rename = { active: false, uid: undefined }
  $: collection = (() => {
    const sort = workspace ? workspace.dashboard.sort : 'asc'

    if (sort === 'asc') {
      return (
        $documentStore.collection.sort((a, b) => {
          if (sortKey === 'createdAt') {
            const c = new Date(a.createdAt).getTime()
            const d = new Date(b.createdAt).getTime()
            return d - c
          }

          if (sortKey === 'updatedAt') {
            const e = new Date(a.updatedAt).getTime()
            const f = new Date(b.updatedAt).getTime()
            return e - f
          }

          return a[sortKey] < b[sortKey] ? 1 : -1
        }) || []
      )
    }

    if (sort === 'desc') {
      return (
        $documentStore.collection.sort((a, b) => {
          if (sortKey === 'createdAt') {
            const c = new Date(a.createdAt).getTime()
            const d = new Date(b.createdAt).getTime()
            return c - d
          }

          if (sortKey === 'updatedAt') {
            const e = new Date(a.updatedAt).getTime()
            const f = new Date(b.updatedAt).getTime()
            return f - e
          }

          return a[sortKey] > b[sortKey] ? 1 : -1
        }) || []
      )
    }

    return $documentStore.collection || []
  })()

  const options: ContextMenuOptions = [
    {
      label: 'Open',
      description: '',
      icon: 'folder-open',
      action: (event: MouseEvent, doc: DocumentModelType): void => {
        event.preventDefault()
        push(`${path}${doc.uid}`)
      },
    },
    'divider',
    {
      label: 'Move to Trash',
      description: '',
      icon: 'trash',
      action: (event: MouseEvent, doc: DocumentModelType) => {
        documentStore.removeDocument(doc.uid)
        showMenu = false
        console.log(event)
      },
    },
    'divider',
    {
      label: 'Rename',
      description: '',
      action: (event: MouseEvent, doc: DocumentModelType) => {
        rename = { active: true, uid: doc.uid }
        console.log('rename', rename)
      },
    },
    {
      label: 'Get Info',
      description: '',
      action: (event: MouseEvent, doc: DocumentModelType) => {
        console.log('Get Info', doc, event)
        showInfo = true
        showMenu = false
      },
    },
    {
      label: 'Duplicate',
      description: '',
      action: (event: MouseEvent, doc: DocumentModelType) => {
        documentStore.duplicateDocument(doc)
        showMenu = false
        console.log(event)
      },
    },
    'divider',
    {
      label: 'Export as JSON',
      description: '',
      icon: 'archive',
      action: (event: MouseEvent, doc: DocumentModelType) =>
        console.log('Export as JSON', doc, event),
    },
    {
      label: 'Share',
      description: '',
      icon: 'share',
      action: (event: MouseEvent, doc: DocumentModelType) =>
        console.log('Share', doc, event),
    },
    'divider',
    {
      label: 'Tags',
      description: '',
      icon: 'tag',
      disabled: true,
      action: (event: MouseEvent, doc: DocumentModelType) =>
        console.log('Share', doc, event),
    },
  ]

  async function trigger(event: MouseEvent, data: Partial<DocumentModelType>) {
    if (showMenu) {
      showMenu = false
      await new Promise((res) => setTimeout(res, 100))
    }
    position = { x: event.clientX, y: event.clientY }
    showMenu = true
    content = data
    documentStore.selectDocument(data.uid)
  }

  function createDocument(): void {
    documentStore.createDocument()
  }

  function selectDocument(event: CustomEvent): void {
    push(path.concat(event.detail.uid))
  }

  function sortByKey(e: CustomEvent<keyof DocumentModelType>): void {
    sortKey = e.detail
  }

  onMount(() => documentStore.getDocuments())
</script>

<DashboardToolbar {title}>
  <button>
    <Icon src={ViewGrid} size="22" outline />
  </button>
  <button>
    <Icon src={ViewList} size="22" outline />
  </button>
  <button class="mr-4">
    <Icon src={ViewBoards} size="22" outline />
  </button>

  <button>
    <Icon src={SortAscending} size="22" outline />
  </button>
  <button>
    <Icon src={SortDescending} size="22" outline />
  </button>
  <button>
    <Icon src={Tag} size="22" outline />
  </button>
</DashboardToolbar>

<nav class="location-toolbar">
  <button class="flex justify-start items-center">
    <Icon src={Plus} size="16" outline />
    <span class="text-sm font-bold ml-1">New</span>
  </button>

  <button class="flex justify-start items-center">
    <Icon src={Upload} size="16" outline />
    <span class="text-sm font-bold ml-1">Import</span>
  </button>
</nav>

{#if workspace}
  {#if workspace.dashboard.view === 'grid'}
    <DocumentGridView
      {path}
      {trigger}
      {collection}
      {rename}
      location={params.location}
      on:rename={(e) => (rename = e.detail)}
      on:sort={sortByKey}
    />
  {:else if workspace.dashboard.view === 'list'}
    <DocumentListView
      {path}
      {trigger}
      {collection}
      {rename}
      location={params.location}
      on:rename={(e) => (rename = e.detail)}
      on:sort={sortByKey}
    />
  {:else if workspace.dashboard.view === 'board'}
    <DocumentBoardView
      {path}
      {trigger}
      {collection}
      {rename}
      location={params.location}
      on:rename={(e) => (rename = e.detail)}
      on:sort={sortByKey}
    />
  {:else}
    <DocumentGridView
      {path}
      {trigger}
      {collection}
      {rename}
      location={params.location}
      on:rename={(e) => (rename = e.detail)}
      on:sort={sortByKey}
    />
  {/if}

  <DocumentContextMenu {position} {showMenu} {content} {options} />
  <Dialog bind:open={showInfo} options={{ static: true, name: 'info' }}>
    <DocumentInfo />
  </Dialog>

  <FuzzySearch
    collection={$documentStore.collection}
    show={showSearch}
    on:close={(e) => {
      console.log(e.detail)
      showSearch = e.detail
    }}
    on:select={selectDocument}
  />
{:else}
  <BlankSlate>
    <h2>We dont's seem to have anything here yet.</h2>
    <p>Gists are like folders that can contain files.</p>
    <Button variant="success" on:click={createDocument}>
      <span>Create Snippet</span>
    </Button>
  </BlankSlate>
{/if}

<style lang="postcss">
  button ~ button {
    @apply ml-3;
  }

  .location-toolbar {
    @apply w-full flex justify-start items-center py-4 px-8 my-5;
  }
</style>
