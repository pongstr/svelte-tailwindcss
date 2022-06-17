<script lang="ts">
  import NavigatorButtons from '../molecules/NavigatorButtons.svelte'

  export let title = ''
  export let editorToolbar = false
</script>

<div class="page-toolbar" {...$$restProps}>
  <div class="toolbar-title">
    <NavigatorButtons {editorToolbar} />
    <h1>{title}</h1>
  </div>
  <slot />
</div>

<style lang="postcss" global>
  .page-toolbar {
    @apply w-full px-4;
    @apply sticky top-0 left-0 right-0 bottom-auto flex items-center justify-between;
    @apply border-b border-b-gray-200 dark:border-gray-700 bg-oh-gray-200/[0.6] dark:bg-oh-black;
    -webkit-app-region: drag;
    z-index: 2000;
    height: 70px;
  }

  .toolbar-title,
  .toolbar-button-group {
    @apply flex items-center justify-between;
  }
  .toolbar-title h1 {
    @apply font-light text-lg;
  }

  .page-toolbar--fixed {
    @apply absolute;
  }
</style>
