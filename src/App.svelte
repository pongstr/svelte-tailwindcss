<script>
  export let name;
</script>

<main class="text-center py-12 max-w-xs mx-auto sm:max-w-none">
  <h1 class="text-red-400 text-6xl uppercase leading-loose font-thin">Hello {name}!</h1>
  <p class="text-stone-700 mt-4">
    Visit the <a class="text-sky-600 hover:underline" href="https://svelte.dev/tutorial">
    Svelte tutorial</a> to learn how to build Svelte apps.
  </p>
</main>

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
