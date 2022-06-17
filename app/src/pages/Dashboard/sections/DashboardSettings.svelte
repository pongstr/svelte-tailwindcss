<script lang="ts">
  import {
    Tab,
    Tabs,
    SettingsIntegration,
    SettingsAppearance,
    SettingsWorkspace,
    SettingsStorageInfo,
  } from '@/components'
  import type {
    SettingsPageTabType,
    WorkspacesModelType,
    WorkspaceStoreInterface,
  } from '@/types'
  import { workspaceStore } from '@/store'
  import DashboardToolbar from '@/components/DashboardTemplate/DashboardToolbar.svelte'

  export let workspaceId = ''
  export let title = ''

  let activeTab: SettingsPageTabType = 'workspace'
  let current: WorkspacesModelType = null

  workspaceStore.subscribe((data: WorkspaceStoreInterface) => {
    if (!data.current) {
      return
    }

    current = data.current

    if (current.setttingsPage) {
      activeTab = current.setttingsPage.currentTab
    }
  })

  function setActiveTab(tabName: SettingsPageTabType): void {
    // const workspaceSettings = $workspace.current
    // workspaceSettings.settings.currentTab = tabName
    // workspace.update(workspaceSettings)
    activeTab = tabName as SettingsPageTabType

    workspaceStore.updateWorkspace({
      ...current,
      setttingsPage: {
        ...current.setttingsPage,
        currentTab: activeTab,
      },
    })
  }
</script>

<svelte:head>
  <title>CodeCrumble: {title}</title>
</svelte:head>

<DashboardToolbar {title} />

{#if $workspaceStore.current}
  <div id="settings-{workspaceId}" class="settings-container">
    <Tabs bind:active={activeTab}>
      <Tab on:click={() => setActiveTab('workspace')} tabid="workspace">
        Workspace
      </Tab>
      <Tab on:click={() => setActiveTab('appearance')} tabid="appearance"
        >Appearance</Tab
      >
      <Tab on:click={() => setActiveTab('location')} tabid="location">
        Location
      </Tab>
      <Tab on:click={() => setActiveTab('storage')} tabid="storage">
        Storage + Database
      </Tab>
    </Tabs>

    {#if activeTab === 'workspace'}
      <SettingsWorkspace />
    {/if}

    {#if activeTab === 'appearance'}
      <SettingsAppearance />
    {/if}

    {#if activeTab === 'location'}
      <SettingsIntegration />
    {/if}

    {#if activeTab === 'storage'}
      <SettingsStorageInfo />
    {/if}

    <!-- <pre>{JSON.stringify(current, null, 2)}</pre> -->
  </div>
{:else}
  Loading...
{/if}

<style lang="postcss">
  .settings-container {
    @apply px-8;
  }
</style>
