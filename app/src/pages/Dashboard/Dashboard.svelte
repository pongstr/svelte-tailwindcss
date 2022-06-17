<script lang="ts">
  import type { DashboardParamsType } from '@/global.d'
  import type { WorkspacesModelType, LocationRecordType } from '@/types'
  import type { RouteLoadedEvent, RouterEvent } from 'svelte-spa-router'
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
  import { Icon, Server, Home, Cog, Trash } from 'svelte-hero-icons'
  import { onMount } from 'svelte'
  import { workspaceStore } from '@/store'
  import DashboardToolbar from '@/components/DashboardTemplate/DashboardToolbar.svelte'
  import DashboardMain from '@/components/DashboardTemplate/DashboardMain.svelte'
  import DashboardRouter from './DashboardRouter.svelte'

  export let params!: DashboardParamsType

  let current: WorkspacesModelType | null = null
  let locations: LocationRecordType[] = []
  let title: string = ''

  const workspacePath = ['', 'd', params.workspaceId, ''].join('/')

  workspaceStore.subscribe((data) => {
    if (data.collection.length === 0) return

    if (!data.current) {
      workspaceStore.getWorkspace(params.workspaceId)
      return
    }

    current = data.current
    if (current && current.location) {
      locations = Object.keys(current.location)
        .map((name) => ({
          ...current.location[name],
        }))
        .filter((item) => item.enabled)
    }
  })

  onMount(() => workspaceStore.listWorkspace())

  function routeEvent(e: RouterEvent<{ title: string }>): void {
    title = e.detail.title
  }
</script>

<svelte:body on:contextmenu|preventDefault />

<DashboardMain overflow={true}>
  <div slot="aside-content">
    <div class="aside-section">
      <span class="aside-section-header">Favorites</span>
      <ul role="menu">
        <li>
          <a use:link use:active href={workspacePath}>
            <Icon src={Home} size="18" outline />
          </a>
          <a use:link use:active href={workspacePath}>Dashboard</a>
        </li>

        <li>
          <a use:link use:active href="{workspacePath}t">
            <Icon src={Trash} size="18" outline />
          </a>
          <a use:link use:active href="{workspacePath}t">Trash</a>
        </li>

        <li>
          <a use:link use:active href="{workspacePath}s">
            <Icon src={Cog} size="18" outline />
          </a>
          <a use:link use:active href="{workspacePath}s">Settings</a>
        </li>
      </ul>
    </div>

    <div class="aside-section">
      <span class="aside-section-header">Locations</span>
      <ul role="menu">
        <li>
          <a use:link use:active href="{workspacePath}l/local">
            <Icon src={Server} size="18" outline />
          </a>
          <a use:link use:active href="{workspacePath}l/local">Local</a>
        </li>

        {#each locations as location}
          <li>
            <a
              use:link
              use:active
              href={[workspacePath, 't', location].join('/')}
            >
              <Icon src={Trash} size="18" outline />
            </a>
            <a
              use:link
              use:active
              href={[workspacePath, 't', location].join('/')}
            >
              {location.name}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <DashboardRouter params={{ workspaceId: params.workspaceId, title }} />
</DashboardMain>
