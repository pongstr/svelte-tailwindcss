<script lang="ts">
  import type { RouteLoadedEvent, RouterEvent } from 'svelte-spa-router'
  import type { DashboardParamsType } from '@/global'
  import Router from 'svelte-spa-router'
  import { wrap } from 'svelte-spa-router/wrap'
  import {
    DashboardContent,
    DashboardSettings,
    DashboardTrash,
    DashboardLocation,
  } from './sections'

  export let routeLoaded: (e: RouteLoadedEvent) => void = () => {
    return
  }
  export let routeEvent: (e: RouterEvent<{ title: string }>) => void = () => {
    return
  }

  export let params: DashboardParamsType = {
    workspaceId: '',
    title: '',
  }

  const prefix = ['', 'd', params.workspaceId].join('/')
  const routes = {
    '/': wrap({
      component: DashboardContent,
      props: {
        ...params,
        title: 'Dashboard',
      },
    }),
    '/s': wrap({
      component: DashboardSettings,
      props: {
        ...params,
        title: 'Settings',
      },
    }),
    '/t': wrap({
      component: DashboardTrash,
      props: {
        ...params,
        title: 'Trash',
      },
    }),
    '/l/:location': wrap({
      component: DashboardLocation,
      props: {
        ...params,
        title: 'Documents',
      },
    }),
    '*': wrap({
      component: DashboardContent,
      props: {
        ...params,
        title: 'Dashboard',
      },
    }),
  }
</script>

<Router
  {routes}
  {prefix}
  restoreScrollState={true}
  on:routeLoaded={routeLoaded && routeLoaded}
  on:routeEvent={routeEvent && routeEvent}
/>
