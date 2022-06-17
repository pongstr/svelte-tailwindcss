import type { DocumentFileModelType } from '@/types'
import type * as Monaco from 'monaco-editor'
import NordTheme from './monaco/theme-nord'
import DraculaTheme from './monaco/theme-dracula'

class MonacoEditor {
  private data!: DocumentFileModelType
  private themes: Record<string, Monaco.editor.IStandaloneThemeData> = {
    NordTheme,
    DraculaTheme,
  }

  public element!: HTMLElement
  public monaco!: typeof Monaco
  public editor!: Monaco.editor.IStandaloneCodeEditor
  public model!: Monaco.editor.ITextModel
  public languages!: Monaco.languages.ILanguageExtensionPoint[]
  public options: Monaco.editor.IEditorConstructionOptions = {
    autoClosingBrackets: 'always',
    autoClosingDelete: 'auto',
    autoClosingOvertype: 'auto',
    autoClosingQuotes: 'always',
    autoIndent: 'brackets',
    dragAndDrop: true,
    emptySelectionClipboard: false,
    folding: true,
    foldingHighlight: true,
    foldingStrategy: 'auto',
    fontFamily: "Consolas, Menlo, 'Courier New', monospace",
    fontSize: 14,
    lineHeight: 20,
    contextmenu: false,
    matchBrackets: 'always',
    guides: {
      bracketPairs: true,
      highlightActiveIndentation: true,
      indentation: true,
    },
    minimap: {
      enabled: false,
      maxColumn: 100,
      renderCharacters: false,
      scale: 1,
      side: 'right',
      showSlider: 'always',
      size: 'proportional',
    },
  }

  constructor(
    data: DocumentFileModelType,
    opts?: Monaco.editor.IEditorConstructionOptions,
  ) {
    this.data = data
    this.options = { ...this.options, ...opts }
  }

  init(mnco: typeof Monaco, element: HTMLElement): MonacoEditor {
    this.monaco = mnco
    this.element = element

    this.setupLanguages()
    this.setupEditor()
    this.setupEditorModel()

    return this
  }

  public setupLanguages(): void {
    this.languages = [...this.monaco.languages.getLanguages()]
    return
  }

  public setupEditor(): void {
    Object.keys(this.themes).forEach((name) =>
      this.monaco.editor.defineTheme(name, this.themes[name]),
    )

    this.editor = this.monaco.editor.create(this.element, {
      theme: 'DraculaTheme',
      ...this.options,
      automaticLayout: true,
      hideCursorInOverviewRuler: true,
      overviewRulerLanes: 0,
      scrollbar: {
        useShadows: false,
        verticalScrollbarSize: 5,
        verticalSliderSize: 5,
        horizontalScrollbarSize: 5,
      },
    })
  }

  public setupEditorModel(): void {
    const editor = this.monaco.editor
    const language = this.getContentLanguage()

    if (this.model) return

    const model = editor.createModel(
      this.data.content,
      language ? language.id : 'plaintext',
      this.monaco.Uri.file(this.data.filename),
    )

    this.model = model
    this.editor.setModel(this.model)

    if (!language) return

    this.data.language = language.id
    this.data.type =
      language.mimetypes && language.mimetypes.length > 0
        ? language.mimetypes[0]
        : `text/${language.id}`
  }

  public getContentLanguage(): Monaco.languages.ILanguageExtensionPoint {
    const filename = this.data.filename
    const extension = filename.slice(
      (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1,
    )
    return this.languages.find(
      (language) =>
        language.extensions &&
        language.extensions.some((item) => item === `.${extension}`),
    )
  }
}

export default MonacoEditor
