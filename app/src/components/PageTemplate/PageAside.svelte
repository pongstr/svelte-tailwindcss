<script lang="ts">
  import { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'
  import HeroIcon from '../atoms/HeroIcon.svelte'
  import WorkspaceSwitcher from '../molecules/WorkspaceSwitcher.svelte'

  export let params: Record<'workspaceId', string> = { workspaceId: '' }

  const workspacePath = `/d/${params.workspaceId}/`
</script>

<aside>
  <div class="app-info">
    <h1 title="v0.1.0-alpha.0">&nbsp;</h1>
  </div>

  <div class="aside-section">
    <div class="aside-section__heading">
      <h4>Favorites</h4>
    </div>
    <div class="aside-section__content">
      <ul class="aside-section__list">
        <li>
          <a href={workspacePath} use:link use:active>
            <HeroIcon size={18} outline={true} icon="home" />
            <span>Dashboard</span>
          </a>
        </li>
        <li>
          <a href="{workspacePath}t" use:link use:active>
            <HeroIcon size={18} outline={true} icon="trash" />
            <span>Trash</span>
          </a>
        </li>
        <li>
          <a href="{workspacePath}s" use:link use:active>
            <HeroIcon size={18} outline={true} icon="cog" />
            <span>Settings</span>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <slot />

  <WorkspaceSwitcher path={workspacePath} />
</aside>

<style lang="postcss" global>
  aside {
    @apply relative flex-grow-0 flex-shrink-0 border-r;
    @apply border-oh-gray-200 dark:border-oh-black;
    @apply bg-gray-100 text-gray-800 dark:bg-oh-blackout dark:text-gray-500;
    flex-basis: 260px;
  }

  .app-info {
    @apply pt-4 pb-2;
    height: 80px;
    -webkit-app-region: drag;
  }

  .aside-section + * {
    @apply mt-5;
  }

  .aside-section__heading {
    @apply flex justify-between items-center;
    @apply py-2 px-4;
  }

  .aside-section__heading h4 {
    @apply inline-block text-xs font-bold uppercase;
  }

  .aside-section__list {
    @apply max-w-full list-none;
  }

  .aside-section__list li {
    @apply flex justify-start items-center py-2 px-4 text-sm;
  }

  .aside-section__list li a {
    @apply inline-flex items-center capitalize transition-colors;
  }

  .aside-section__list li a span + * {
    @apply ml-3;
  }

  .aside-section__list li a:hover {
    @apply text-oh-purple;
  }
</style>
