import { Subscriber, Unsubscriber } from 'svelte/store'
import type { DuplicateFileType } from '.'
import { DocumentModelType, CreateFileType } from './documents.d'

export type DocumentErrorResponseType = {
  message: string
  status: number
  name: string
  docid: string
}

export type DocumentCacheType = {
  active: string
  editors: string[]
}

export interface DocumentStoreInterface {
  collection: Partial<DocumentModelType>[]
  trashbin: Partial<DocumentModelType>[]
  current: DocumentModelType | null
  selected: string | null
  cached: DocumentCacheType | null
}

export type DocumentStoreReturnType = {
  subscribe: (
    this: void,
    run: Subscriber<DocumentStoreInterface>,
  ) => Unsubscriber

  getDocument: (payload: GetDocumentQueryType) => void
  getDocuments: (payload?: GetDocumentsQueryType) => void
  createDocument: (payload?: DocumentModelType) => void
  updateDocument: (
    payload: DocumentModelType | Partial<DocumentModelType>,
  ) => void
  removeDocument: (payload: string) => void
  duplicateDocument: (payload: DocumentModelType) => void
  selectDocument: (payload: string) => void
  deSelectDocument: (payload: string) => void
  createFile: (payload: CreateFileType) => void
  updateFile: (payload: UpdateFileType) => void
  deleteFile: (payload: DeleteFileType) => void
  duplicateFile: (payload: DuplicateFileType) => void

  // local+session storage persistence
  getDocumentCache: (paylod: string) => DocumentCacheType | null
  createDocumentCache: (paylod: string) => DocumentCacheType
  updateDocumentCache: (
    uid: string,
    paylod: DocumentCacheType,
  ) => DocumentCacheType
  removeDocumentCache: (paylod: string) => void
}
