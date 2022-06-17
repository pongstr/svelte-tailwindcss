<script lang="ts">
  import {
    Icon,
    ChevronLeft,
    ChevronRight,
    QuestionMarkCircle,
    Search,
  } from 'svelte-hero-icons'

  export let title = ''
</script>

<nav class="main-toolbar">
  <div class="toolbar-navigator">
    <button>
      <Icon src={ChevronLeft} size="22" outline />
    </button>
    <button>
      <Icon src={ChevronRight} size="22" outline />
    </button>

    <span class="text-lg font-medium">{title}</span>
  </div>

  <div class="toolbar-navigator ml-auto">
    <slot />
  </div>

  <div class="toolbar-navigator ml-auto">
    <button>
      <Icon src={Search} size="22" outline />
    </button>
    <button>
      <Icon src={QuestionMarkCircle} size="22" outline />
    </button>
  </div>
</nav>

<style lang="postcss" global>
  .main-toolbar {
    @apply w-full flex justify-start items-center py-4 px-8 border-b bg-white/[0.95];
    @apply sticky top-0 z-50;
  }

  .toolbar-navigator {
    @apply flex justify-start items-center;
  }

  .toolbar-navigator button ~ button,
  .toolbar-navigator button ~ span {
    @apply ml-2;
  }
</style>
