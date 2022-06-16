<script lang="ts">
  import { querystring } from 'svelte-spa-router';
  import {
    Icon,
    FolderOpen,
    Server,
    Home,
    Cog,
    Trash,
    Plus,
    ChevronRight,
  } from 'svelte-hero-icons';
  import Toolbar from '../components/Toolbar.svelte';
  import DashboardTemplate from '../components/DashboardTemplate.svelte';
  import SnippetsGrid from '../components/SnippetsGrid.svelte';

  const local = [1, 1, 1, 1];

  console.log($querystring);
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

  <Toolbar />

  <div class="dashboard-contents">
    <div class="section">
      <div class="section-header">
        <div class="flex items-center">
          <Icon src={Server} size="22" outline class="mr-2" />
          <h2>Local</h2>
        </div>

        <button class="flex items-center ml-4">
          <Icon src={Plus} size="18" outline />
          <span class="sr-only">Add Local Snippet</span>
        </button>

        <button class="flex items-center ml-auto">
          <span class="text-xs font-bold uppercase inline-block mr-2">
            See All
          </span>
          <Icon src={ChevronRight} size="16" outline />
        </button>
      </div>

      <SnippetsGrid collection={local} />
    </div>

    {#if $querystring !== 'state=empty'}
      <div class="section">
        <div class="section-header">
          <div class="flex items-center">
            <Icon src={FolderOpen} size="22" outline class="mr-2" />
            <h2>Github</h2>
          </div>

          <button class="flex items-center ml-4">
            <Icon src={Plus} size="18" outline />
            <span class="sr-only">Add Local Snippet</span>
          </button>

          <button class="flex items-center ml-auto">
            <span class="text-xs font-bold uppercase inline-block mr-2">
              See All
            </span>
            <Icon src={ChevronRight} size="16" outline />
          </button>
        </div>

        <SnippetsGrid collection={local} />
      </div>

      <div class="section">
        <div class="section-header">
          <div class="flex items-center">
            <Icon src={FolderOpen} size="22" outline class="mr-2" />
            <h2>Gitlab</h2>
          </div>

          <button class="flex items-center ml-4">
            <Icon src={Plus} size="18" outline />
            <span class="sr-only">Add Local Snippet</span>
          </button>

          <button class="flex items-center ml-auto">
            <span class="text-xs font-bold uppercase inline-block mr-2">
              See All
            </span>
            <Icon src={ChevronRight} size="16" outline />
          </button>
        </div>

        <SnippetsGrid collection={local} />
      </div>

      <div class="section">
        <div class="section-header">
          <div class="flex items-center">
            <Icon src={FolderOpen} size="22" outline class="mr-2" />
            <h2>Bitbucket</h2>
          </div>

          <button class="flex items-center ml-4">
            <Icon src={Plus} size="18" outline />
            <span class="sr-only">Add Local Snippet</span>
          </button>

          <button class="flex items-center ml-auto">
            <span class="text-xs font-bold uppercase inline-block mr-2">
              See All
            </span>
            <Icon src={ChevronRight} size="16" outline />
          </button>
        </div>

        <SnippetsGrid collection={local} />
      </div>

      <div class="section">
        <div class="section-header">
          <div class="flex items-center">
            <Icon src={FolderOpen} size="22" outline class="mr-2" />
            <h2>Dropbox</h2>
          </div>

          <button class="flex items-center ml-4">
            <Icon src={Plus} size="18" outline />
            <span class="sr-only">Add Local Snippet</span>
          </button>

          <button class="flex items-center ml-auto">
            <span class="text-xs font-bold uppercase inline-block mr-2">
              See All
            </span>
            <Icon src={ChevronRight} size="16" outline />
          </button>
        </div>

        <SnippetsGrid collection={local} />
      </div>
    {/if}
  </div>
</DashboardTemplate>

<style lang="postcss">
  .dashboard-contents {
    @apply divide-y pb-72;
  }

  .section {
    @apply pb-10;
  }

  .section-header {
    @apply sticky top-14 z-10 py-6 px-10 flex justify-start items-center mb-8;
    @apply bg-white/[0.95];
  }

  .section-header h2 {
    @apply font-bold text-lg;
  }
</style>
