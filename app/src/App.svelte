<script lang="ts">
  import Router from 'svelte-spa-router'
  import wrap from 'svelte-spa-router/wrap'
  import { Unsupported } from '@/components'
  import Workspace from './pages/Workspace/Workspace.svelte'

  export let name = ''

  const routes = {
    '/': Workspace,
    '/d/:workspaceId': wrap({
      asyncComponent: () => import('./pages/Dashboard/Dashboard.svelte'),
    }),
    '/d/:workspaceId/*': wrap({
      asyncComponent: () => import('./pages/Dashboard/Dashboard.svelte'),
    }),
  }
</script>

<Router {routes} />
<Unsupported {name} />

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .divider {
    @apply bg-gray-400 mx-2 my-4 border-t border-t-gray-300 border-b border-b-gray-50;
    height: 0;
  }

  .context-menu {
    @apply fixed block p-1 rounded-lg shadow-2xl overflow-clip bg-white/[0.95] z-10;
    @apply text-sm border border-gray-300;
    min-width: 230px;

    & a,
    & a:hover,
    & a:active,
    & a:visited,
    &__item svg,
    &__content svg {
      @apply text-gray-500;
    }

    &__item {
      @apply flex justify-start items-center rounded p-2 cursor-pointer;
      @apply hover:bg-gray-200;
    }

    &__item span {
      min-width: 24px;
    }

    &__item span ~ span {
      @apply ml-3;
    }

    &__divider {
      @apply my-1 -mx-4 bg-gray-300;
      height: 1px;
    }
  }
</style>
