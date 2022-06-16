<script lang="ts">
  import { querystring } from 'svelte-spa-router';
  import { Icon, Inbox, InformationCircle } from 'svelte-hero-icons';
  import BlankSlate from './BlankSlate.svelte';

  export let collection: unknown[] = [];
</script>

{#if $querystring === 'state=empty'}
  <div class="mx-8">
    <BlankSlate boxed={true}>
      <Icon
        src={Inbox}
        size="64"
        outline
        class="text-gray-400 box mx-auto mt-10 mb-5"
      />

      <h2>You don’t seem to have any Snippets</h2>
      <p>Use it to provide information when no dynamic content exists.</p>

      <button>Create Snippet</button><br />

      <a class="inline-block my-4 text-sm" href="#/">Learn more</a>
    </BlankSlate>
  </div>
{:else}
  <div class="collection-grid">
    {#each collection as item}
      <div class="collection-item">
        <header>
          <span class="block truncate font-medium">
            Super Califragilistic Expialidocious Super Califragilistic
            Expialidocious: {item}
          </span>
          <button class="ml-auto">
            <Icon src={InformationCircle} size="18" outline />
          </button>
        </header>
        <section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam odio
          arcu, lobortis sit amet est at, facilisis euismod tellus. Nullam eu
          odio quis tortor bibendum ultrices ut sed nisi. Class aptent taciti
          sociosqu ad litora torquent per conubia nostra
        </section>
        <footer>
          <span>Created a few seconds ago</span>
          <span>0 Files</span>
        </footer>
      </div>
    {/each}
  </div>
{/if}

<style lang="postcss">
  .collection-grid {
    @apply grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 auto-rows-max gap-8 mx-10 mb-10;
  }

  .collection-item {
    @apply flex flex-col justify-between items-center p-4 border cursor-pointer rounded transition-shadow;
    @apply hover:shadow-lg;
    min-height: 180px;
  }

  .collection-item header,
  .collection-item footer {
    @apply w-full flex justify-between items-center;
  }

  .collection-item section,
  .collection-item footer {
    @apply text-xs;
  }

  .collection-item section {
    @apply line-clamp-3 pr-5;
  }
</style>
