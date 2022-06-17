<script lang="ts">
  import {
    Icon,
    ViewGrid,
    ViewList,
    ViewBoards,
    SortAscending,
    SortDescending,
    Tag,
  } from 'svelte-hero-icons'
  import DashboardToolbar from '@/components/DashboardTemplate/DashboardToolbar.svelte'

  export let workspaceId = ''
  export let title = ''
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

<code>{title} + {workspaceId}</code>
