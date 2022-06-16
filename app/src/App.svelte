<script lang="ts">
  import Router from 'svelte-spa-router';
  import Profiles from './pages/profiles.svelte';
  import Dashboard from './pages/dashboard.svelte';
  import Home from './pages/home.svelte';
  import Snippet from './pages/snippet.svelte';
  import Location from './pages/location.svelte';

  const routes = {
    '/': Home,
    '/dashboard': Dashboard,
    '/snippet': Snippet,
    '/location': Location,
    '/profiles': Profiles,
  };
</script>

<Router {routes} />

<style lang="postcss" global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  .divider {
    @apply bg-gray-400 mx-2 my-4 border-t border-t-gray-300 border-b border-b-gray-50;
    height: 0;
  }
</style>
