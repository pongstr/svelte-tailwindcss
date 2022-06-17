<script lang="ts">
  import type { DocumentFileModelType, IDocumentEditorActions } from '@/types'
  import { CodeEditor, BlankSlate } from '../atoms'

  export let active: string = ''
  export let files: DocumentFileModelType[] = []
  export let actions!: IDocumentEditorActions
</script>

<div class="editor-panel" class:editor-panel--empty={files.length === 0}>
  {#if files.length > 0}
    {#each files as file}
      <div
        class="editor-container"
        class:editor-container--active={active === file.filename}
      >
        <CodeEditor {file} on:save={actions.update} />
      </div>
    {/each}
  {:else}
    <BlankSlate height="70%" class="align-self-center">
      <h2>Nothing here yet.</h2>
      <p>Someone finally took care of the trash.</p>
    </BlankSlate>
  {/if}
</div>

<style lang="sass">
.editor-panel
  position: relative
  height: 98%
  margin-left: var(--spacing)
  margin-right: var(--spacing)
  border-radius: var(--border-radius)

.editor-container
  position: absolute
  top: var(--spacing)
  right: var(--spacing)
  bottom: var(--spacing)
  left: 0
  z-index: 1
  visibility: hidden

  &--active
    z-index: 100
    visibility: visible

:global(.theme-dark) .editor-panel
  background-color: var(--black)

  &--empty
    background-color: transparent
</style>
