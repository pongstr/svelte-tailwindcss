import PouchDB from 'pouchdb'
import * as monaco from 'monaco-editor'

export type WorkspaceMessageResponseType = {
  name: string
  message: string
}

export type WorkspaceErrorType = WorkspaceMessageResponseType & {
  error: boolean
  stack?: string
}

export type SettingsPageTabType =
  | 'location'
  | 'workspace'
  | 'appearance'
  | 'storage'

export type LocationType = 'local' | 'github' | 'gitlab' | 'bitbucket'

export type LocationRecordType = {
  name: LocationType
  token: string
  enabled: boolean
}

export type WorkspaceMsgEventType =
  | 'create'
  | 'update'
  | 'remove'
  | 'list'
  | 'get'

export type WorkspaceMsgEventContext = {
  type: WorkspaceMsgEventType
  payload:
    | WorkspacesModelType
    | WorkspacesModelType[]
    | string
    | null
    | undefined
}

export type WorkspaceAvatarType = {
  filename: string
  content: string
}

export type WorkspacesModelType = {
  _id: string
  _rev?: string
  _attachments?: Record<string, { content_type: string; data: string }>
  uid: string
  name: string
  avatar: WorkspaceAvatarType
  createdAt: Date | undefined
  updatedAt: Date | undefined
  description: string
  active: boolean
  default: boolean
  editor: monaco.editor.IEditorConstructionOptions
  location: {
    local?: LocationRecordType
    github: LocationRecordType
    gitlab: LocationRecordType
    bitbucket: LocationRecordType
  }
  theme: 'dark' | 'light' | 'system'
  dashboard: {
    view: 'grid' | 'list' | 'board'
    sort: 'asc' | 'desc'
    workspaces: boolean
  }
  setttingsPage: {
    currentTab: SettingsPageTabType
  }
}

export interface WorkspaceOperationsFnType {
  getWorkspaceInfo: () => Promise<
    PouchDB.Core.DatabaseInfo | WorkspaceErrorType
  >
  getWorkspace: (
    id: string,
  ) => Promise<WorkspacesModelType | WorkspaceErrorType>

  getWorkspaces: () => Promise<
    Partial<WorkspacesModelType>[] | WorkspaceErrorType
  >

  createWorkspace: (
    data?: Partial<WorkspacesModelType>,
  ) => Promise<WorkspacesModelType | WorkspaceErrorType>

  updateWorkspace: (
    data: WorkspacesModelType,
  ) => Promise<WorkspacesModelType | WorkspaceErrorType>

  removeWorkspace(
    id: string,
  ): Promise<WorkspaceMessageResponseType | WorkspaceErrorType>
}
