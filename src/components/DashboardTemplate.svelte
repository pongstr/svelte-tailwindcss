<script lang="ts">
  import { Icon, Cog, UserCircle, Server, Plus } from 'svelte-hero-icons';
  import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
  } from '@rgossiaux/svelte-headlessui';
  import Pongstr from '../components/Pongstr.svelte';
  import { createPopperActions } from 'svelte-popperjs';

  export let overflow = false;

  const [popperUserRef, popperUserContent] = createPopperActions();
  const [popperSettingsRef, popperSettingsContent] = createPopperActions();

  const popperOptions = {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, 15] } }],
  };
</script>

<div class="dashboard">
  <header>
    <div>
      <div class="text-center p-1">
        <Pongstr />
      </div>
      <slot name="shortcuts" />
    </div>

    <div class="header-settings">
      <Popover as="div" class="relative z-10">
        <PopoverButton class="block my-4 mx-auto" use={[popperUserRef]}>
          <Icon src={UserCircle} size="26" outline class="text-gray-600" />
        </PopoverButton>
        <Transition
          enter="ease-out duration-300 fixed z-20"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300 fixed z-20"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <PopoverPanel use={[[popperUserContent, popperOptions]]}>
            <div class="popover-content">
              <span class="popover-content-section">Profiles</span>
              <a href="#/snippet">
                <img
                  class="avatar avatar-sm"
                  src="https://github.com/pongstr.png"
                  alt="Pongstr"
                />
                <span>Pongstr</span>
              </a>

              <a href="#/snippet">
                <img
                  class="avatar avatar-sm"
                  src="https://github.com/dumbledork.png"
                  alt="DumbleDork"
                />
                <span>DumbleDork</span>
              </a>

              <div class="popover-divider" />

              <a href="#/snippet">
                <Icon src={Plus} size="18" outline class="mx-2" />
                <span class="text-xs uppercase font-bold">Add Profile</span>
              </a>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>

      <Popover as="div" class="relative z-10">
        <PopoverButton class="block my-4 mx-auto" use={[popperSettingsRef]}>
          <Icon src={Cog} size="26" outline class="text-gray-600" />
        </PopoverButton>
        <Transition
          enter="ease-out duration-300 fixed z-20"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300 fixed z-20"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <PopoverPanel use={[[popperSettingsContent, popperOptions]]}>
            <div class="popover-content">
              <span class="popover-content-section">Settings</span>
              <a href="#/">
                <span>Workspace</span>
                <span class="block ml-auto">Shortcut</span>
              </a>
              <a href="#/">
                <span>Theme</span>
                <span class="block ml-auto">Shortcut</span>
              </a>
              <a href="#/">
                <span>Integrations</span>
                <span class="block ml-auto">Shortcut</span>
              </a>
              <a href="#/">
                <span>Storage+Database</span>
                <span class="block ml-auto">Shortcut</span>
              </a>
            </div>
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  </header>
  <aside>
    <slot name="aside-content" />
  </aside>
  <main class:overflow-y-auto={overflow}>
    <slot />
  </main>
</div>

<style lang="postcss" global>
  .dashboard {
    @apply w-full h-full overflow-hidden flex flex-nowrap items-stretch justify-start;
  }

  .dashboard > header {
    @apply flex flex-col justify-between flex-shrink-0 flex-grow-0;
    @apply border-r border-gray-200 bg-gray-100;
    width: 70px;
  }

  .dashboard > aside {
    @apply flex-shrink-0 flex-grow-0;
    @apply border-r border-gray-200 bg-gray-50;
    width: 250px;
  }

  .dashboard > main {
    @apply flex-grow flex-shrink;
  }

  .aside-section {
    @apply px-0 mb-4;
  }

  .aside-section ~ .aside-section {
    @apply mt-8;
  }

  .aside-section-header {
    @apply w-full flex justify-start items-center text-xs uppercase font-bold z-10;
    @apply px-2 pt-2 py-5 bg-gray-200/[0.4];
  }

  .aside-section ul {
    @apply my-3;
  }

  .aside-section li {
    @apply flex justify-start items-center py-1 text-sm px-4;
  }

  .aside-section li a ~ a {
    @apply ml-2;
  }

  .popover-content {
    @apply my-4 bg-white shadow-lg border border-gray-50 rounded-lg overflow-clip;
    min-width: 220px;
  }

  .popover-divider {
    @apply -mx-3 bg-gray-200;
    height: 1px;
  }

  .popover-content .popover-content-section {
    @apply w-full flex justify-start items-center text-xs uppercase font-bold z-10;
    @apply block p-4;
  }

  .popover-content a {
    @apply flex items-center justify-start px-4 py-1;
  }

  .popover-content a ~ * {
    @apply my-2;
  }

  .popover-content a span {
    @apply text-sm;
  }

  .avatar {
    @apply inline-block rounded-full;
  }

  .avatar ~ * {
    @apply ml-4;
  }

  .avatar-sm {
    width: 32px;
    height: 32px;
  }
</style>
