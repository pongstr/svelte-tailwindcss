import type { DocumentModelType } from './documents.d'

export type ContextMenuOptionType = {
  label: string
  description: string
  icon?: string
  disabled?: boolean
  content?: HTMLElement
  action: (event: Event, doc: Partial<DocumentModelType> | null) => void
}

export type ContextMenuOptions = Array<ContextMenuOptionType | 'divider'>
