<script lang="ts">
  import type { DocumentModelType } from '@/types'
  import { tick, onDestroy, createEventDispatcher } from 'svelte'
  import fuzzysort from 'fuzzysort'
  import { dateFromNow, dateSimple } from '@/utils'
  import HeroIcon from './HeroIcon.svelte'
  import ButtonIcon from './ButtonIcon.svelte'

  export let show = false
  export let collection: Partial<DocumentModelType>[] = []
  export let keys: string[] = ['name', 'description', 'uid']
  export let value = 'Untitled'

  type RenderOptionsType = {
    obj: Partial<DocumentModelType>
    html: string
  }

  const dispatch = createEventDispatcher()
  let listEl: HTMLDivElement
  let inputEl: HTMLInputElement | undefined

  $: filteredOptions = getFilteredOptions(value, collection, keys)
  $: availiableOptions = renderOptions(value, filteredOptions, collection)
  $: show && focusText()

  onDestroy(() => window.addEventListener('keydown', onKeyDown))

  function onClose(): void {
    show = false
    dispatch('close', show)
  }

  function onAction(option: Partial<DocumentModelType>): void {
    dispatch('select', option)
    show = false
  }

  async function focusText(): Promise<void> {
    try {
      value = ''
      await tick()
      inputEl.focus()
    } catch (err: unknown) {
      return
    }
  }

  function getFilteredOptions(
    value: string,
    collection: Partial<DocumentModelType>[],
    keys: string[],
  ): Fuzzysort.KeysResults<Partial<DocumentModelType>> {
    return fuzzysort.go(value, collection, { keys })
  }

  function renderOptions(
    value: string | undefined,
    filteredOptions: Fuzzysort.KeysResults<Partial<DocumentModelType>>,
    collection: Partial<DocumentModelType>[],
  ): RenderOptionsType[] {
    const visibleOptions = value
      ? filteredOptions.map(({ obj }) => obj)
      : collection

    return visibleOptions.map(
      (obj: Partial<DocumentModelType>, index: number) => {
        const results = Object.keys(keys).map((name: string, idx: number) => {
          const filtered = filteredOptions[index]

          if (!filtered) {
            return []
          }

          if (filtered[idx] && filtered[idx]) {
            return [
              keys[name],
              fuzzysort.highlight(
                filtered[idx],
                '<strong style="color: var(--primary-color)">',
                '</strong>',
              ),
            ]
          }

          return [keys[name], obj[keys[name]]]
        })
        return {
          obj,
          html: {
            ...Object.fromEntries(results),
          },
        }
      },
    )
  }

  function onKeyDown(e: KeyboardEvent) {
    //  alt+s
    if (e.altKey && e.code === 'KeyS') {
      value = ''
      show = !show
      inputEl.focus()
      e.preventDefault()
    }

    if (!show) return

    switch (e.code) {
      // ESC
      case 'Escape':
        onClose()
        break
      // ArrowUp
      case 'ArrowUp':
        if (document.activeElement === inputEl) {
          ;(listEl.lastChild as HTMLDivElement).focus()
        } else if (document.activeElement.previousSibling) {
          ;(document.activeElement.previousSibling as HTMLInputElement).focus()
        } else {
          ;(listEl.lastChild as HTMLUListElement).focus()
        }
        e.preventDefault()
        break
      // ArrowDown
      case 'ArrowDown':
        if (document.activeElement === inputEl) {
          ;(listEl.firstChild as HTMLDivElement).focus()
        } else if (document.activeElement.nextSibling) {
          ;(document.activeElement.nextSibling as HTMLInputElement).focus()
        } else {
          ;(listEl.firstChild as HTMLDivElement).focus()
        }
        e.preventDefault()
        break
      // Enter
      case 'Enter':
        const index = Array.prototype.slice
          .call(listEl.children)
          .indexOf(document.activeElement)
        const option: RenderOptionsType | undefined =
          availiableOptions[index === -1 ? 0 : index]

        if (option) {
          onAction(option.obj)
        }
        break
      // Allow nativation with more keys
      // case "16": // SHIFT
      // case "17": // CTRL
      // case "18": // ALT
      // case "9": // TAB
      // console.log(e.keyCode);
      // break;
      // Any other key
      default:
        if (
          (e.key.length === 1 &&
            e.ctrlKey === false &&
            e.altKey === false &&
            e.metaKey === false) ||
          e.key === 'Backspace'
        ) {
          inputEl.focus()
        }
        break
    }
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="fuzzy-container" class:show>
  <div class="fuzzy-container__content">
    <div class="fuzzy-container__search">
      <form class="fuzzy-form" on:submit|preventDefault>
        <span>
          <HeroIcon icon="search" size={24} />
        </span>
        <input
          type="search"
          id="fuzzySearch"
          name="fuzzySearch"
          placeholder="Filter Keywords..."
          bind:value
          bind:this={inputEl}
        />
        {#if value.trim() !== ''}
          <sapn>
            <ButtonIcon
              icon="x"
              float
              size={24}
              on:click={() => (value = '')}
            />
          </sapn>
        {/if}
      </form>
    </div>
    <div class="fuzzy-container__results">
      <div class="fuzzy-container__results_list">
        {#if value.trim() !== ''}
          <div class="list" bind:this={listEl}>
            {#each availiableOptions as option, i}
              <div tabindex={i} on:click={() => onAction(option.obj)}>
                {#each keys as key}
                  <span>
                    {@html option.html[key]}
                  </span>
                {/each}
                <small>
                  {option.obj.description || 'Description placeholder'}
                </small>
                <small>
                  {option.obj.updatedAt
                    ? dateFromNow(option.obj.updatedAt)
                    : dateSimple(option.obj.createdAt)}
                  {option.obj.fileCount} Files
                </small>
              </div>
            {:else}
              <div class="empty">
                <p>Can't seem to find what you're looking for?</p>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>
    <div class="fuzzy-container__helpers">
      <span>
        <span class="kbd">
          <svg width="15" height="15"
            ><g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.2"
              ><path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3" /></g
            ></svg
          >
        </span>
        <span>to select</span>
      </span>
      <span>
        <span class="kbd">
          <svg width="15" height="15">
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.2"
            >
              <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" />
            </g>
          </svg>
        </span>
        <span class="kbd">
          <svg width="15" height="15"
            ><g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.2"><path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" /></g
            ></svg
          >
        </span>
        <span>to navigate</span>
      </span>
      <span>
        <span class="kbd">
          <svg width="15" height="15">
            <g
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.2"
            >
              <path
                d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956"
              />
            </g>
          </svg>
        </span>
        <span>to close</span>
      </span>
    </div>
  </div>
</div>

<style lang="sass">
.fuzzy-container
  position: fixed
  top: 0
  left: 0
  z-index: 2000
  width: 100vw
  height: 100vh
  display: none
  justify-content: center
  align-items: start
  padding: 45px

  &.show
    display: flex

.fuzzy-container__content
  min-width: 540px
  max-width: 60%
  padding: var(--spacing) var(--spacing) 0
  border-radius: var(--border-radius)
  box-shadow: 0 0 12px rgba(var(--rgb-black), 0.75)
  background-color: var(--blackout)

.fuzzy-container__results_list
  max-height: 480px
  margin-left: calc(var(--spacing) * -1)
  margin-right: calc(var(--spacing) * -1)
  padding: 0 var(--spacing)
  overflow-y: auto
  background-color: var(--blackout)

  & div
    margin-top: var(--spacing)

  & div,
  & div > div:not(.empty)
    list-style: none
    margin-left: 0

  & div > div:not(.empty)
    margin-top: 1px
    margin-bottom: 1px
    padding: calc(var(--spacing) / 2)
    cursor: pointer
    border-radius: calc(var(--border-radius) / 4)

  & div > div:hover:not(.empty)
    color: var(--gray-200)
    background-color: rgba(var(--rgb-gray-300), 0.35)

  & div > div:focus:not(.empty)
    color: var(--gray-200)
    background-color: rgba(var(--rgb-gray-300), 0.55)

  & div > div span,
  & div > div small
    display: block

.fuzzy-form
  position: relative
  margin-bottom: var(--spacing)
  padding: 0 var(--spacing)
  display: flex
  align-items: center
  border: 2px solid var(--gray-400)
  border-radius: calc(var(--border-radius) / 2)

  &,
  &:focus,
  &:focus-within
    transition: border-color .2s ease

  &:focus,
  &:focus-within
    border-color: var(--secondary-color)

  input[type="search"]::-webkit-search-cancel-button
    -webkit-appearance: none

:global(.fuzzy-form)
  &:focus > span,
  &:focus-within > span
    color: var(--primary-color)

.fuzzy-form input[type="search"]
  width: 100%
  height: 50px
  margin: 0
  font-size: 18px

  &,
  &:focus
    border-color: transparent
    background-color: transparent

.fuzzy-container__helpers
  margin-left: calc(var(--spacing) * -1)
  margin-right: calc(var(--spacing) * -1)
  padding: calc(var(--spacing) / 2) var(--spacing)
  font-size: 75%
  background-color: var(--black)
  border-top: 1px solid var(--gray-400)
  border-bottom-left-radius: var(--border-radius)
  border-bottom-right-radius: var(--border-radius)

  &,
  & > span,
  & > span > span
    display: flex
    justify-content: space-between
    align-items: center

  & > span:not(&>span:first-of-type)
    margin: 0 8px

  & span > .kbd
    width: 22px
    height: 18px
    justify-content: center
    margin-right: 0.4em
    padding-bottom: 1px
    background: var(--gray-400)
    border-radius: 2px
    box-shadow: 0 2px 2px var(--blackout)
    color: var(--success-color)
</style>
