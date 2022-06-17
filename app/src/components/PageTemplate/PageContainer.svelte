<div class="page-container">
  <slot name="aside" />
  <slot name="main" />
</div>

<style lang="postcss" global>
  .page-container {
    @apply h-full flex items-stretch overflow-hidden;
  }
</style>
