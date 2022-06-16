<script>
  import shortUID from 'short-uuid';
  import {
    Icon,
    DotsVertical,
    Plus,
    Cog,
    PencilAlt,
    Trash,
  } from 'svelte-hero-icons';
  import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem,
    Transition,
  } from '@rgossiaux/svelte-headlessui';
  import Button from '../components/Button.svelte';

  const uuid = shortUID();
  const profiles = [
    {
      uid: uuid.generate(),
      name: 'Pongstr',
      avatar: 'https://github.com/pongstr.png',
      active: true,
      default: true,
    },
    {
      uid: uuid.generate(),
      name: 'DumbleDork',
      avatar: 'https://github.com/dumbledork.png',
      active: true,
      default: false,
    },
  ];
</script>

<main>
  <header>
    <div>
      <h1>Ohhai!</h1>
      <p>
        With profiles you can separate all your Github stuff. Create profiles
        for friends and family, or split between work and fun.
      </p>
    </div>
  </header>

  <section>
    {#each profiles as profile}
      <div class="profile-card">
        <div class="profile-card-header">
          <div class="profile-name">{profile.name}</div>
          <div class="profile-menu">
            <Menu>
              <MenuButton class="flex justify-end items-center">
                <Icon src={DotsVertical} size="18" />
              </MenuButton>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <MenuItems class="absolute right-0 mt-2 origin-top-right">
                  <div class="menu-items">
                    <MenuItem>
                      <a href="#/profiles">
                        <Icon class="my-2 mr-2" src={PencilAlt} size="18" />
                        <span>Edit</span>
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <a href="#/profiles">
                        <Icon class="my-2 mr-2" src={Cog} size="18" />
                        <span>Settings</span>
                      </a>
                    </MenuItem>

                    <div class="menu-divider" />
                    <MenuItem>
                      <a href="#/profiles">
                        <Icon class="my-2 mr-2" src={Trash} size="18" />
                        <span>Delete</span>
                      </a>
                    </MenuItem>
                  </div>
                </MenuItems>
              </Transition>
            </Menu>
          </div>
        </div>
        <div class="profile-card-avatar">
          <img src={profile.avatar} alt={profile.name} />
        </div>
        <div class="profile-card-footer" />
      </div>
    {/each}
    <button class="profile-card">
      <div class="profile-card-header">&nbsp;</div>
      <div class="profile-card-avatar">
        <Icon class="my-3" src={Plus} size="48" />
      </div>
      <div class="profile-card-footer">New Profile</div>
    </button>
  </section>

  <footer>
    <div>
      <Button>Guest Mode</Button>
    </div>

    <div>
      <form>
        <label for="show-startup">
          <input
            type="checkbox"
            id="show-startup"
            name="show-startup"
            checked
          />
          <span class="text-sm">Show on Startup</span>
        </label>
      </form>
    </div>
  </footer>
</main>

<style lang="postcss">
  :global(html),
  :global(body) {
    @apply overflow-hidden;
  }

  :global(html),
  :global(body),
  main {
    @apply w-full h-full;
  }

  main {
    @apply flex flex-col flex-nowrap justify-between items-center;
  }

  header,
  footer {
    @apply flex-grow-0 flex-shrink-0 py-6;
    flex-basis: 25%;
  }

  header {
    @apply flex items-end;
  }

  header div {
    @apply py-6 sm:w-2/3	lg:w-3/5 mx-auto text-center;
  }

  header h1 {
    @apply block mb-4 font-bold text-3xl;
  }

  header p {
    @apply text-xl;
  }

  footer {
    @apply w-full lg:w-9/12 mx-auto flex justify-between items-start px-8;
  }

  footer input[type='checkbox'] ~ * {
    @apply inline-block ml-1;
  }

  section {
    @apply w-full lg:w-4/5 mx-auto flex-grow lg:flex-grow-0 flex justify-center flex-wrap overflow-y-auto;
    @apply py-10 border-t border-b lg:border-t-transparent lg:border-b-transparent;
  }

  .profile-card {
    @apply flex flex-col justify-between items-center p-4 m-4 rounded-lg border cursor-pointer;
    flex-basis: 180px;
    height: 200px;
  }

  .profile-card-header {
    @apply w-full flex justify-between items-center pt-2 px-2;
  }

  .profile-card-footer {
    @apply text-sm;
  }

  .profile-card-avatar img {
    @apply rounded-full;
    width: 92px;
    height: auto;
  }

  .profile-name {
    @apply text-sm flex-grow text-center mr-2;
  }

  .profile-menu {
    @apply relative -mr-3 justify-self-end;
  }

  :global(.menu-items) {
    @apply bg-gray-50 border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none;
    @apply p-1 overflow-clip;
    width: 150px;
  }

  :global(.menu-divider) {
    @apply bg-gray-200 -mx-2 my-2;
    height: 1px;
  }

  :global(.menu-items a) {
    @apply flex items-center px-3 text-sm rounded;
  }

  :global(.menu-items a ~ a) {
    @apply mb-2;
  }

  :global(.menu-items a:hover) {
    @apply bg-gray-100;
  }
</style>
