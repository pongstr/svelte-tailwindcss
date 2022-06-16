<script lang="ts">
  import {
    Icon,
    FolderOpen,
    Server,
    Home,
    Cog,
    Trash,
    Collection,
    DocumentText,
    ChevronRight,
  } from 'svelte-hero-icons';
  import {
    Popover,
    PopoverButton,
    PopoverPanel,
    Transition,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  } from '@rgossiaux/svelte-headlessui';
  import DashboardTemplate from '../components/DashboardTemplate.svelte';

  import { createPopperActions } from 'svelte-popperjs';

  const [popperRef, popperContent] = createPopperActions();

  // Example Popper configuration
  const popperOptions = {
    placement: 'auto',
    strategy: 'fixed',
    modifiers: [{ name: 'offset', options: { offset: [0, 15] } }],
  };
</script>

<DashboardTemplate>
  <div slot="shortcuts">
    <div class="divider" />

    <button class="block my-4 mx-auto">
      <Icon src={Home} size="24" outline class="text-gray-600" />
    </button>

    <Popover as="div" class="relative z-10">
      <PopoverButton class="block my-4 mx-auto" use={[popperRef]}>
        <Icon src={Collection} size="24" outline class="text-gray-600" />
      </PopoverButton>
      <Transition
        enter="ease-out duration-300 fixed z-20"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-300 fixed z-20"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <PopoverPanel use={[[popperContent, popperOptions]]}>
          <div class="popover-content">
            <span class="popover-content-section">Locations</span>
            <a href="#/snippet">
              <Icon src={Server} size="18" outline class="mr-2" />
              <span>Local</span>
            </a>
            <a href="#/snippet">
              <Icon src={FolderOpen} size="18" outline class="mr-2" />
              <span>Github</span>
            </a>
            <a href="#/snippet">
              <Icon src={FolderOpen} size="18" outline class="mr-2" />
              <span>Gitlab</span>
            </a>

            <a href="#/snippet">
              <Icon src={FolderOpen} size="18" outline class="mr-2" />
              <span>Bitbucket</span>
            </a>
            <a href="#/snippet">
              <Icon src={FolderOpen} size="18" outline class="mr-2" />
              <span>Dropbox</span>
            </a>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>

    <button class="block my-4 mx-auto">
      <Icon src={Trash} size="24" outline class="text-gray-600" />
    </button>
  </div>

  <div slot="aside-content">
    <div class="aside-section divide-y">
      <Disclosure let:open defaultOpen={true}>
        <DisclosureButton class="aside-section-header">
          <Icon
            src={ChevronRight}
            size="18"
            outline
            class="mr-2"
            style={open ? 'transform: rotate(90deg);' : ''}
          />
          <span>Open Files</span>
        </DisclosureButton>

        <DisclosurePanel>
          <ul role="menu">
            <li>
              <a href="#/snippet">
                <Icon src={DocumentText} size="18" outline />
              </a>
              <a href="#/snippet">Button.svelte</a>
            </li>
            <li>
              <a href="#/snippet">
                <Icon src={DocumentText} size="18" outline />
              </a>
              <a href="#/snippet">Dialog</a>
            </li>
            <li>
              <a href="#/snippet">
                <Icon src={DocumentText} size="18" outline />
              </a>
              <a href="#/snippet">Disclosure.svelte</a>
            </li>
          </ul>
        </DisclosurePanel>
      </Disclosure>

      <Disclosure let:open defaultOpen={true}>
        <DisclosureButton class="aside-section-header">
          <Icon
            src={ChevronRight}
            size="18"
            outline
            class="mr-2"
            style={open ? 'transform: rotate(90deg);' : ''}
          />
          <span>Files</span>
        </DisclosureButton>

        <DisclosurePanel>
          <ul role="menu">
            <li>
              <a href="#/snippet">
                <Icon src={DocumentText} size="18" outline />
              </a>
              <a href="#/snippet">Button.svelte</a>
            </li>
            <li>
              <a href="#/snippet">
                <Icon src={DocumentText} size="18" outline />
              </a>
              <a href="#/snippet">Dialog</a>
            </li>
            <li>
              <a href="#/snippet">
                <Icon src={DocumentText} size="18" outline />
              </a>
              <a href="#/snippet">Disclosure.svelte</a>
            </li>
            <li>
              <a href="#/snippet">
                <Icon src={DocumentText} size="18" outline />
              </a>
              <a href="#/snippet">Menu.svelte</a>
            </li>
          </ul>
        </DisclosurePanel>
      </Disclosure>
    </div>
  </div>

  Content
</DashboardTemplate>
