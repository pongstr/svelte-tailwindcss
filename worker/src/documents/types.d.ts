export type DocumentMessageResponseType = {
  name: string
  message: string
}

export type DocumentErrorType = DocumentMessageResponseType & {
  error: boolean
  stack?: string
}

export type LocationType = 'local' | 'github' | 'gitlab' | 'bitbucket'

export type DocumentMsgEventType =
  | 'create'
  | 'update'
  | 'remove'
  | 'list'
  | 'get'
  | 'duplicate'
  | 'fileCreate'
  | 'fileUpdate'
  | 'fileDelete'
  | 'fileDuplicate'
  | 'fileRename'
  | 'fileImport'
  | 'fileExport'

export type DocumentMsgEventContext = {
  type: DocumentMsgEventType
  payload:
    | DocumentModelType
    | DocumentModelType[]
    | SetStoreDocumentsType
    | CreateFileType
    | UpdateFileType
    | DeleteFileType
    | string
    | null
    | undefined
}

export type DocumentCategoryType = 'code' | 'note' | 'todo'
export type DocumentFileModelType = {
  filename: string
  description: string
  category: DocumentCategoryType
  type: string
  language: string
  url?: string
  size?: number
  content: string
  createdAt: Date
  updatedAt: Date | null
}

export type DocumentModelType = {
  _id: string
  _rev?: string
  uid: string
  workspaceId: string
  location: LocationType
  name: string
  description: string
  createdAt: Date
  updatedAt: Date | null
  active: boolean
  files?: Record<string, DocumentFileModelType>
  fileCount?: number
  size: number
  tags: string[]
}

export type DocumentFileCollectionType = Omit<DocumentFileModelType, 'content'>
export type DocumentModelCollectionType = Omit<DocumentModelType, 'files'> & {
  files: Record<string, DocumentFileCollectionType> | undefined
}

export type SetStoreDocumentsType = {
  collection: Partial<DocumentModelType>[]
  trashbin: Partial<DocumentModelType>[]
  current: DocumentModelType | null
}

export type GetDocumentQueryType = {
  uid: string
  location?: LocationType
  active?: boolean
}

export type GetDocumentsQueryType = {
  workspaceId: string
  location?: LocationType
  active?: boolean
}

export type CreateDocumentParamType = {
  workspaceId: string
  location?: LocationType
  data?: Partial<DocumentModelType>
}

export type CreateFileType = {
  docId: string
  data?: DocumentFileModelType
}

export type UpdateFileType = {
  docId: string
  data: DocumentFileModelType
}

export type DeleteFileType = {
  docId: string
  filename: string
}

export type DuplicateFileType = {
  docId: string
  filename: string
}

export type RenameFileType = DuplicateFileType & {
  newFilename: string
}

export interface DocumentOperationsFnType {
  getDocumentsInfo: () => Promise<PouchDB.Core.DatabaseInfo | DocumentErrorType>

  getDocument: (
    query: GetDocumentQueryType,
  ) => Promise<DocumentModelType | DocumentErrorType>

  getDocuments: (
    query: GetDocumentsQueryType,
  ) => Promise<DocumentModelCollectionType[] | DocumentErrorType>

  createDocument(
    opts: CreateDocumentParamType,
  ): Promise<DocumentModelType | DocumentErrorType>

  updateDocument(
    data?: DocumentModelType,
  ): Promise<DocumentModelType | DocumentErrorType>

  removeDocument(
    id: string,
  ): Promise<DocumentMessageResponseType | DocumentErrorType>

  duplicateDocument(
    data: DocumentModelType,
  ): Promise<DocumentModelType | DocumentErrorType>

  createFile(
    opts: CreateFileType,
  ): Promise<DocumentModelType | DocumentErrorType>

  updateFile(
    opts: UpdateFileType,
  ): Promise<DocumentModelType | DocumentErrorType>

  deleteFile(
    opts: DeleteFileType,
  ): Promise<DocumentModelType | DocumentErrorType>

  duplicateFile(
    opts: DuplicateFileType,
  ): Promise<DocumentModelType | DocumentErrorType>
}

export interface IDocumentEditorActions {
  createCodeFile: (event?: Event) => void
  createNoteFile: (event?: Event) => void
  createTodoFile: (event?: Event) => void
  active: (filename: string) => void
  close: (filename: string) => void
  update: (event: CustomEvent<DocumentFileModelType>) => void
  remove: (filename: string) => void
  rename: (file: DocumentFileModelType) => void
  duplicate: (filename: string) => void
}
