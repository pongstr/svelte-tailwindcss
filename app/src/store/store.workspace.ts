import { writable } from 'svelte/store'
import type {
  WorkspaceStoreInterface,
  WorkspacesModelType,
  WorkspaceStoreReturnType,
  WorkspaceMsgEventContext,
  WorkspaceErrorResponseType,
} from '@/types/index.d'

const workspaceWorker = new Worker('./app/worker/workspaces.min.js')

const session: Storage = window.sessionStorage
const storage: Storage = window.localStorage
const namespace = 'codecrumble'

const showProfile = storage.getItem(`${namespace}:show_profiles`)

if (!showProfile) {
  storage.setItem(`${namespace}:show_profiles`, String(true))
}

const workspaceStore = ((worker: Worker): WorkspaceStoreReturnType => {
  const { subscribe, set, update } = writable<WorkspaceStoreInterface>({
    collection: [],
    isLoading: false,
    initSpace: true,
    current: null,
    profiles: JSON.parse(showProfile),
  })

  function getWorkspace(id: string): void {
    worker.postMessage({ type: 'get', payload: id })
  }

  function listWorkspace(): void {
    worker.postMessage({ type: 'list', payload: null })
  }

  function createWorkspace(workspace?: Partial<WorkspacesModelType>): void {
    worker.postMessage({ type: 'create', payload: workspace })
  }

  function updateWorkspace(workspace: Partial<WorkspacesModelType>): void {
    worker.postMessage({ type: 'update', payload: { ...workspace } })
  }

  function setWorkspacesCollection(collection: WorkspacesModelType[]): void {
    return set({
      collection,
      isLoading: false,
      initSpace: true,
      current: null,
      profiles: JSON.parse(showProfile),
    })
  }

  function setCreatedWorkspace(
    workspace: WorkspacesModelType | WorkspaceErrorResponseType,
  ): void {
    if (Object.prototype.hasOwnProperty.call(workspace, 'error')) {
      return update(
        (store): WorkspaceStoreInterface => ({
          ...store,
          error: { ...(workspace as WorkspaceErrorResponseType) },
          current: null,
        }),
      )
    }

    const {
      _id,
      uid,
      avatar,
      createdAt,
      updatedAt,
      description,
      name,
      active,
    } = workspace as WorkspacesModelType
    session.setItem(`${namespace}:current_workspace`, uid)
    return update(
      (store): WorkspaceStoreInterface => ({
        ...store,
        collection: [
          { _id, uid, avatar, createdAt, updatedAt, description, name, active },
          ...store.collection,
        ],
        isLoading: false,
        initSpace: false,
        current: {
          ...(workspace as WorkspacesModelType),
        },
      }),
    )
  }

  function updateCurrentWorkspace(workspace: WorkspacesModelType): void {
    return update(
      (store): WorkspaceStoreInterface => ({
        ...store,
        isLoading: false,
        initSpace: false,
        current: workspace,
      }),
    )
  }

  function setShowProfile(profiles: boolean): void {
    storage.setItem(`${namespace}:show_profiles`, String(profiles))
    return update((store) => ({
      ...store,
      profiles,
    }))
  }

  /**
   * The event listener below acts as sort-of the reducer that receives the data
   * from the worker and applies the upates to the streo.
   */
  worker.addEventListener(
    'message',
    (event: MessageEvent<WorkspaceMsgEventContext>): void => {
      const { payload, type } = event.data

      switch (type) {
        case 'get':
          workspaceStore.setCreatedWorkspace(payload as WorkspacesModelType)
          break

        case 'list':
          workspaceStore.setWorkspacesCollection(
            payload as WorkspacesModelType[],
          )
          break

        case 'create':
          workspaceStore.setCreatedWorkspace(payload as WorkspacesModelType)
          break

        case 'update':
          workspaceStore.updateCurrentWorkspace(payload as WorkspacesModelType)
          break

        default:
          return
      }
    },
  )

  return {
    subscribe,
    getWorkspace,
    listWorkspace,
    createWorkspace,
    updateWorkspace,
    setWorkspacesCollection,
    setCreatedWorkspace,
    setCurrentWorkspace: setCreatedWorkspace,
    setShowProfile,
    updateCurrentWorkspace,
  }
})(workspaceWorker)

export default workspaceStore
