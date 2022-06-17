<script lang="ts">
  import { workspaceStore } from '@/store'
  import HeroIcon from '../atoms/HeroIcon.svelte'

  let appearance = $workspaceStore.current
    ? $workspaceStore.current.theme
    : 'dark'

  function updateTheme(event: Event): void {
    event.preventDefault()
    workspaceStore.updateWorkspace({
      ...$workspaceStore.current,
      theme: appearance,
    })
  }
</script>

<div class="settings-section">
  <header>
    <HeroIcon size={24} outline icon="color-swatch" />
    <h2 class="heading">Theme Selector</h2>
  </header>
  <section style="color: rgba(var(--rgb-gray-100), 0.5)">
    <div class="theme-mode-container">
      <label for="dark-mode-preview" class:active={appearance === 'dark'}>
        <span class="preview-img">
          <img src="./img/dark_preview.svg" alt="Light Mode" />
        </span>
        <span class="preview-label">
          <input
            bind:group={appearance}
            on:change={updateTheme}
            id="dark-mode-preview"
            type="radio"
            value="dark"
          />
          <span>Dark Mode</span>
        </span>
      </label>

      <label for="light-mode-preview" class:active={appearance === 'light'}>
        <span class="preview-img">
          <img src="./img/light_preview.svg" alt="Light Mode" />
        </span>
        <span class="preview-label">
          <input
            bind:group={appearance}
            on:change={updateTheme}
            id="light-mode-preview"
            type="radio"
            value="light"
          />
          <span>Light Mode</span>
        </span>
      </label>

      <label for="auto-mode-preview" class:active={appearance === 'system'}>
        <span class="preview-img preview-img--clipped">
          <img src="./img/dark_preview.svg" alt="Light Mode" />
          <img src="./img/light_preview.svg" alt="Light Mode" />
        </span>
        <span class="preview-label">
          <input
            bind:group={appearance}
            on:change={updateTheme}
            id="auto-mode-preview"
            type="radio"
            value="system"
          />
          <span>System Preference</span>
        </span>
      </label>
    </div>
  </section>
</div>

<style lang="postcss">
  .theme-mode-container {
    @apply flex justify-start items-center mx-4 py-4;
  }

  .theme-mode-container label {
    @apply block m-4 border-2 rounded-lg cursor-pointer;
    @apply dark:border-oh-gray-500;
  }

  .theme-mode-container label.active {
    @apply border-oh-purple dark:border-oh-purple;
  }

  .preview-img {
    @apply flex justify-center items-center overflow-clip m-2;
    @apply dark:border-oh-gray-500;
    width: 228px;
    height: 120px;
  }

  .preview-img img {
    @apply rounded-t;
  }

  .preview-img--clipped img:first-of-type {
    @apply absolute;
    clip: rect(0, 114px, 200px, 0);
  }

  .preview-label {
    @apply flex justify-start items-center m-2;
  }

  .preview-label > span {
    @apply px-2;
  }
</style>
