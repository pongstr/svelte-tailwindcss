<script lang="ts">
  import {
    Icon,
    FolderOpen,
    Server,
    Home,
    Cog,
    Trash,
    ViewBoards,
    ViewGrid,
    ViewList,
    Plus,
    SortAscending,
    SortDescending,
    Tag,
    Upload,
  } from 'svelte-hero-icons';
  import Toolbar from '../components/Toolbar.svelte';
  import DashboardTemplate from '../components/DashboardTemplate.svelte';
  import SnippetsGrid from '../components/SnippetsGrid.svelte';

  const arr = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1,
  ];
</script>

<DashboardTemplate overflow={true}>
  <div slot="aside-content">
    <div class="aside-section">
      <span class="aside-section-header">Favorites</span>
      <ul role="menu">
        <li>
          <a href="#/dashboard"><Icon src={Home} size="18" outline /></a>
          <a href="#/dashboard">Dashboard</a>
        </li>
        <li>
          <a href="#/dashboard"><Icon src={Trash} size="18" outline /></a>
          <a href="#/dashboard">Trash</a>
        </li>

        <li>
          <a href="#/dashboard"><Icon src={Cog} size="18" outline /></a>
          <a href="#/dashboard">Settings</a>
        </li>
      </ul>
    </div>

    <div class="aside-section">
      <span class="aside-section-header">Locations</span>
      <ul role="menu">
        <li>
          <a href="#/dashboard"><Icon src={Server} size="18" outline /></a>
          <a href="#/dashboard">Local</a>
        </li>
        <li>
          <a href="#/dashboard"><Icon src={FolderOpen} size="18" outline /></a>
          <a href="#/dashboard">Github</a>
        </li>
        <li>
          <a href="#/dashboard"><Icon src={FolderOpen} size="18" outline /></a>
          <a href="#/dashboard">GitLab</a>
        </li>
        <li>
          <a href="#/dashboard"><Icon src={FolderOpen} size="18" outline /></a>
          <a href="#/dashboard">Bitbucket</a>
        </li>
      </ul>
    </div>
  </div>

  <Toolbar>
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
  </Toolbar>

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

  <SnippetsGrid collection={arr} />
</DashboardTemplate>

<style lang="postcss">
  button ~ button {
    @apply ml-3;
  }

  .location-toolbar {
    @apply w-full flex justify-start items-center py-4 px-8 my-5;
  }
</style>
