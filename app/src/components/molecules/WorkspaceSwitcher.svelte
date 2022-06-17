<script lang="ts">
  import { workspaceStore } from '@/store'
  import type { WorkspacesModelType } from '@/types'
  import { push, link } from 'svelte-spa-router'
  import { Avatar, ButtonIcon, HeroIcon } from '../atoms'

  export let path: string = ''

  $: toggle = false
  $: toggleIcon = toggle ? 'chevron-up' : 'chevron-down'
  $: current = $workspaceStore.current || null

  let workspaces: Partial<WorkspacesModelType>[] = []

  workspaceStore.subscribe((data) => {
    if (data.collection.length === 0 || !data.current) return

    workspaces = [...data.collection].filter(
      (item: Partial<WorkspacesModelType>) => item.uid !== data.current.uid,
    )
  })

  function openWorkspaces(): void {
    window.open(window.location.origin, 'workspaces')
  }

  function openWorkspace(item: Partial<WorkspacesModelType>): void {
    const workspace = `${window.location.origin}/#/d/${item.uid}/`
    window.open(workspace, item.name.toLowerCase())
  }

  function openSettings(): void {
    push(`${path}s`)
  }
</script>

<div
  class="workspaces border-t border-t-oh-gray-200 dark:border-t-oh-gray-500/[0.5]"
>
  <div class="workspace-current">
    {#if $workspaceStore.current}
      <span class="workspace-info" on:click|preventDefault={openSettings}>
        {#if current.avatar && current.avatar.filename && current.avatar.content.trim() !== ''}
          <Avatar url={current.avatar.content} alt={current.avatar.filename} />
        {:else}
          <Avatar on:click={openSettings} />
        {/if}
        <span>{current.name}</span>
      </span>
      <ButtonIcon
        on:click={() => (toggle = !toggle)}
        float
        size={16}
        outline={true}
        icon={toggleIcon}
      />
    {/if}
  </div>
  <div class="workspace-selection" class:active={toggle}>
    <ul class="workspace-list">
      {#if $workspaceStore.collection}
        {#each workspaces as workspace}
          <li class="workspace-list__item">
            <a
              href={`${path}s`}
              use:link
              on:click|preventDefault={() => openWorkspace(workspace)}
            >
              <span class="workspace-info">
                {#if workspace.avatar.filename && workspace.avatar.content.trim() !== ''}
                  <Avatar
                    on:click={openSettings}
                    url={workspace.avatar.content}
                    alt={workspace.avatar.filename}
                  />
                {:else}
                  <Avatar on:click={openSettings} />
                {/if}
                <span>{workspace.name}</span>
              </span>
            </a>
          </li>
        {/each}
        <li class="workspace-list__item">
          <span on:click|preventDefault={() => openWorkspaces()}>
            <HeroIcon size={28} icon="plus-circle" outline />
            <span>Add Workspace</span>
          </span>
        </li>
      {/if}
    </ul>
  </div>
</div>

<style lang="postcss">
  .workspaces {
    @apply absolute bottom-0 left-0 w-full transition-colors;
    z-index: 100;
  }

  .workspace-current,
  .workspace-info {
    @apply flex items-center;
  }

  .workspace-info {
    @apply mr-2;
  }

  .workspace-info {
    @apply flex-grow flex-shrink-0;
  }

  .workspace-current {
    @apply cursor-pointer justify-between py-2 px-4;
  }

  .workspace-selection,
  .workspace-selection.active {
    transition: height 0.2s cubic-bezier(0, 0, 0.2, 1);
  }

  .workspace-selection {
    @apply overflow-hidden;
    height: 0;
  }

  .workspace-selection.active {
    @apply overflow-y-auto;
    height: 300px;
    max-height: 300;
  }

  .workspace-list {
    @apply block;
  }

  .workspace-list__item {
    @apply w-full flex items-center cursor-pointer py-2 px-4;
  }
</style>
