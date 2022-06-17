import { Subscriber, Unsubscriber } from 'svelte/store'
import { WorkspacesModelType } from './workspaces.d'

export type WorkspaceErrorResponseType = {
  message: string
  status: number
  name: string
  docid: string
}

export interface WorkspaceStoreInterface {
  collection: Partial<WorkspacesModelType>[]
  isLoading: boolean
  initSpace: boolean
  error?: WorkspaceErrorResponseType
  current: WorkspacesModelType | null
  profiles: boolean
}

export type WorkspaceStoreReturnType = {
  subscribe: (
    this: void,
    run: Subscriber<WorkspaceStoreInterface>,
  ) => Unsubscriber
  getWorkspace: (id: string) => void
  listWorkspace: () => void
  createWorkspace: (data: Partial<WorkspacesModelType>) => void
  updateWorkspace: (data: Partial<WorkspacesModelType>) => void
  setWorkspacesCollection: (data: WorkspacesModelType[]) => void
  setCreatedWorkspace: (data: WorkspacesModelType) => void
  setCurrentWorkspace: (data: WorkspacesModelType) => void
  updateCurrentWorkspace: (data: WorkspacesModelType) => void
  setShowProfile: (profiles: boolean) => void
}
