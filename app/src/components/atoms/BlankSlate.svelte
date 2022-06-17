<script lang="ts">
  export let boxed = false;
</script>

<div class="blank-slate" class:blank-slate-boxed={boxed}>
  <div class="blank-slate-content">
    <slot>
      <h2>This is a blank slate</h2>
      <p>Use it to provide information when no dynamic content exists.</p>
    </slot>
  </div>
</div>

<style lang="postcss" global>
  .blank-slate {
    @apply flex justify-center items-center py-10 text-center;
  }

  .blank-slate-boxed {
    @apply border rounded-lg;
  }

  .blank-slate-content h2,
  .blank-slate-content p {
    @apply block mx-auto;
  }

  .blank-slate-content h2 {
    @apply mb-2 text-xl font-bold;
  }

  .blank-slate-content p {
    @apply mb-4 text-sm text-gray-600;
  }
</style>
