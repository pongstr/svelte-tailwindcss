<script lang="ts">
  import type { DocumentFileModelType } from '@/types'
  import { onMount, createEventDispatcher, onDestroy } from 'svelte'
  import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
  import loader from '@monaco-editor/loader'
  import { MonacoEditor } from '@/utils'

  export let file!: DocumentFileModelType

  let editorContainer!: HTMLDivElement
  let editor!: Monaco.editor.IStandaloneCodeEditor
  let model!: Monaco.editor.ITextModel
  // let languages: Monaco.languages.ILanguageExtensionPoint[] = []

  const dispatch = createEventDispatcher()

  async function initEditor(): Promise<void> {
    const monaco = (await loader.init()) as typeof Monaco
    const newEditor = new MonacoEditor(file)
    const createEditor = newEditor.init(monaco, editorContainer)

    // languages = [...createEditor.languages]
    editor = createEditor.editor
    model = createEditor.model

    if (!monaco || !editor) return

    attachActions()
  }

  function deInitEditor(): void {
    if (!editor || !model) return
    model.dispose()
    editor.dispose()
    editor = null
    window.onresize = null
    return
  }

  function saveFile(): void {
    if (!editor) return
    dispatch('save', { ...file, content: editor.getValue() })
  }

  function cycleTabs(): void {
    if (!editor) return
    dispatch('cycleTabs', file.filename)
  }

  function attachActions(): void {
    if (!editor) return

    editor.addAction({
      id: 'cc:save',
      label: 'Save Current File',
      run: saveFile,
      keybindings: [Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.KeyS],
    })

    editor.addAction({
      id: 'cc:cycle:tabs',
      label: 'Cycle Tabs',
      run: cycleTabs,
      keybindings: [
        Monaco.KeyMod.CtrlCmd | Monaco.KeyMod.Shift | Monaco.KeyCode.Tab,
      ],
    })
  }

  // init editor
  onMount(initEditor)

  // destory editor
  onDestroy(deInitEditor)
</script>

<div class="code-editor-container" bind:this={editorContainer} />

<style lang="sass">
.code-editor-container
  width: 100%
  height: 100%
</style>
