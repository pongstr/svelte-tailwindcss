import { CustomWorker } from '../main.d'
import type { WorkspacesModelType } from './types'
import { WorkspaceMsgEventContext, WorkspaceErrorType } from './types.d'
import operations from './operations'

self.importScripts('./main.worker.min.js')
self.name = 'codecrumble:workspaces'

// init workspace worker
;((wrkr) => {
  const ops = operations(wrkr)
  async function getWorkspacesFn(): Promise<void> {
    try {
      const response = await ops.getWorkspaces()
      wrkr.postMessage({ type: 'list', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as WorkspaceErrorType })
    }
  }
  async function getWorkspaceFn(id: string): Promise<void> {
    try {
      const response = await ops.getWorkspace(id)
      wrkr.postMessage({ type: 'get', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as WorkspaceErrorType })
    }
  }
  async function createWorkspaceFn(
    workspace: Partial<WorkspacesModelType>,
  ): Promise<void> {
    try {
      const response = await ops.createWorkspace(workspace)
      wrkr.postMessage({ type: 'create', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as WorkspaceErrorType })
    }
  }
  async function updateWorkspaceFn(
    workspace: WorkspacesModelType,
  ): Promise<void> {
    try {
      const response = await ops.updateWorkspace(workspace)
      wrkr.postMessage({ type: 'update', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as WorkspaceErrorType })
    }
  }
  async function removeWorkspaceFn(id: string): Promise<void> {
    try {
      const response = await ops.removeWorkspace(id)
      wrkr.postMessage({ type: 'remove', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as WorkspaceErrorType })
    }
  }
  async function getWorkspaceInfoFn(): Promise<void> {
    try {
      const response = await ops.getWorkspaces()
      wrkr.postMessage({ type: 'info', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as WorkspaceErrorType })
    }
  }
  wrkr.addEventListener(
    'message',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
    async (event: MessageEvent<WorkspaceMsgEventContext>): Promise<void> => {
      const { payload, type } = event.data
      switch (type) {
        case 'list':
          await getWorkspacesFn()
          break
        case 'get':
          await getWorkspaceFn(payload as string)
          break
        case 'create':
          await createWorkspaceFn(payload as Partial<WorkspacesModelType>)
          break
        case 'update':
          await updateWorkspaceFn(payload as WorkspacesModelType)
          break
        case 'remove':
          await removeWorkspaceFn(payload as string)
          break
        default:
          await getWorkspaceInfoFn()
      }
    },
  )
})(self as unknown as CustomWorker)
