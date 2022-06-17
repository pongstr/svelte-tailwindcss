<script lang="ts">
  import type { ContextMenuOptions, DocumentFileModelType } from '@/types'
  import { ContextMenu, HeroIcon } from '../atoms'

  export let position = { x: 0, y: 0 }
  export let showMenu = false
  export let content: Partial<DocumentFileModelType> | null = null
  export let options: ContextMenuOptions = []

  function closeMenu(): void {
    showMenu = false
    position = { x: 0, y: 0 }
  }
</script>

{#if showMenu && content}
  <ContextMenu {...position} on:click={closeMenu} on:clickoutside={closeMenu}>
    {#each options as option}
      {#if typeof option === 'string'}
        <div class="context-menu__divider" />
      {:else}
        <div
          class="context-menu__item"
          class:context-menu__item--disabled={option.disabled}
          on:click={(e) => {
            option.action(e, content)
            closeMenu()
          }}
        >
          {#if option.icon}
            <HeroIcon outline icon={option.icon} size={16} />
          {/if}
          <span>{option.label}</span>
        </div>
      {/if}
    {/each}
  </ContextMenu>
{/if}
