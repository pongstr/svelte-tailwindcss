<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let variant = 'default';
  export let utility = false;
  export let type: 'button' | 'submit' = 'button';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher<{ click: Event }>();
  const forwardEvent = (event: Event): void => {
    dispatch('click', event);
  };
</script>

{#if utility}
  <button
    {type}
    {disabled}
    class={variant ? `btn-util-${variant}` : 'btn-util'}
    on:click={forwardEvent}
  >
    <slot />
  </button>
{:else}
  <button
    {type}
    {disabled}
    class={variant ? `btn-${variant}` : 'btn'}
    on:click={forwardEvent}
  >
    <slot />
  </button>
{/if}

<style lang="postcss">
  :global(.btn ~ *) {
    @apply ml-2;
  }

  .btn-default,
  .btn-primary,
  .btn-secondary,
  .btn-info,
  .btn-danger,
  .btn-danger,
  .btn-success {
    @apply px-4 py-1.5 rounded-full border-2 text-sm font-medium transition-colors;
    @apply inline-flex justify-center items-center;
  }

  .btn-util-default,
  .btn-util-primary,
  .btn-util-secondary,
  .btn-util-info,
  .btn-util-warning,
  .btn-util-danger,
  .btn-util-success {
    @apply inline-flex mx-1 my-2 px-4 py-2 rounded-md border text-sm font-medium transition-colors;
    @apply dark:hover:bg-oh-blackout/[0.75];
    @apply border-oh-gray-200 bg-oh-gray-200/[0.85];
    @apply dark:border-oh-blackout dark:bg-oh-blackout/[0.85];
  }

  .btn-default {
    @apply border-oh-blackout/[0.14] dark:border-oh-whiteout/[0.14];
    @apply bg-oh-gray-200/[0.4] hover:bg-gray-400/[0.2];
  }

  .btn-util-default {
    @apply hover:text-oh-gray-500 hover:bg-gray-100;
    @apply dark:hover:text-oh-gray-100;
  }

  .btn-primary {
    @apply text-oh-pink hover:text-white;
    @apply bg-oh-pink/[0.1] border-oh-pink hover:bg-oh-pink;
  }

  .btn-util-primary {
    @apply text-oh-pink hover:text-white hover:bg-oh-pink hover:border-oh-pink dark:hover:text-oh-pink;
  }

  .btn-secondary {
    @apply text-oh-purple hover:text-white;
    @apply bg-oh-purple/[0.1] border-oh-purple hover:bg-oh-purple;
  }

  .btn-util-secondary {
    @apply text-oh-purple hover:text-white hover:bg-oh-purple hover:border-oh-purple dark:hover:text-oh-purple;
  }

  .btn-info {
    @apply text-cyan-700 hover:text-cyan-800 dark:text-oh-blue dark:hover:text-cyan-800;
    @apply bg-oh-blue/[0.1] border-oh-blue hover:bg-oh-blue;
  }

  .btn-util-info {
    @apply text-cyan-700 hover:text-cyan-800 hover:bg-oh-blue hover:border-oh-blue dark:hover:text-oh-blue;
  }

  .btn-warning {
    @apply text-oh-orange hover:text-white;
    @apply bg-oh-orange/[0.1] border-oh-orange hover:bg-oh-orange;
  }

  .btn-util-warning {
    @apply text-orange-500 hover:text-white hover:bg-oh-orange hover:border-oh-orange dark:hover:text-oh-orange;
  }

  .btn-danger {
    @apply text-oh-red hover:text-white;
    @apply bg-oh-red/[0.1] border-oh-red hover:bg-oh-red;
  }

  .btn-util-danger {
    @apply text-oh-red hover:text-white hover:bg-oh-red hover:border-oh-red dark:hover:text-oh-red;
  }

  .btn-success {
    @apply text-green-600 hover:text-green-900;
    @apply dark:text-oh-green dark:hover:text-green-900;
    @apply bg-oh-green/[0.1] border-oh-green hover:bg-oh-green;
  }

  .btn-util-success {
    @apply text-green-600 hover:text-green-900 hover:bg-oh-green hover:border-oh-green dark:hover:text-oh-green;
  }
</style>
