import { writable } from 'svelte/store'
import type {
  CreateDocumentParamType,
  CreateFileType,
  DeleteFileType,
  DocumentCacheType,
  DocumentModelType,
  DocumentMsgEventContext,
  DocumentStoreInterface,
  DocumentStoreReturnType,
  DuplicateFileType,
  GetDocumentQueryType,
  GetDocumentsQueryType,
  SetStoreDocumentsType,
  UpdateFileType,
} from '@/types/index.d'

// import 'main.worker'

const cache: Storage = window.localStorage
const session: Storage = window.sessionStorage
const namespace = 'codecrumble'

const documentWorker = new Worker('./app/worker/documents.min.js')

const documentStore = ((worker: Worker): DocumentStoreReturnType => {
  const { subscribe, update } = writable<DocumentStoreInterface>({
    collection: [],
    trashbin: [],
    current: null,
    selected: session.getItem(`${namespace}:active_document`),
    cached: null,
  })

  function getDocumentCache(uid: string): DocumentCacheType | null {
    const cachedDocInfo = cache.getItem(`${namespace}:${uid}`)
    return cachedDocInfo ? JSON.parse(cachedDocInfo) : null
  }

  function createDocumentCache(uid: string): DocumentCacheType {
    cache.setItem(
      `${namespace}:${uid}`,
      JSON.stringify({ active: '', editors: [] }),
    )
    return getDocumentCache(uid)
  }

  function updateDocumentCache(
    uid: string,
    payload: DocumentCacheType,
  ): DocumentCacheType {
    cache.setItem(
      `${namespace}:${uid}`,
      JSON.stringify({ ...getDocumentCache(uid), ...payload }),
    )
    const cached = getDocumentCache(uid)
    update((store) => ({
      ...store,
      cached,
    }))
    return cached
  }

  function removeDocumentCache(uid: string): void {
    cache.removeItem(`${namespace}:${uid}`)
    session.getItem(`${namespace}:active_document`)
  }

  function selectDocument(uid: string): void {
    session.setItem(`${namespace}:active_document`, uid)
    update((store) => ({
      ...store,
      selected: session.getItem(`${namespace}:active_document`),
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function deSelectDocument(uid: string): void {
    session.removeItem(`${namespace}:active_document`)
    update((store) => ({
      ...store,
      selected: null,
    }))
  }

  function getDocuments(payload?: GetDocumentsQueryType): void {
    const workspaceId = session.getItem(`${namespace}:current_workspace`)
    const currentActiveDoc = session.getItem(`${namespace}:active_document`)

    if (currentActiveDoc) {
      getDocument({ uid: currentActiveDoc })
    }

    worker.postMessage({
      type: 'list',
      payload: {
        workspaceId,
        active: true,
        location: payload && payload.location ? payload.location : 'local',
      },
    })
  }

  function setDocuments(payload: SetStoreDocumentsType): void {
    return update((store: DocumentStoreInterface) => ({
      ...store,
      ...payload,
    }))
  }

  function getDocument(payload: GetDocumentQueryType): void {
    const workspaceId = session.getItem(`${namespace}:current_workspace`)
    worker.postMessage({
      type: 'get',
      payload: {
        workspaceId,
        active: true,
        uid: payload.uid,
      },
    })
  }

  function setCurrentDocument(current: DocumentModelType): void {
    if (Object.prototype.hasOwnProperty.call(current, 'error')) {
      console.error(current)
      return
    }

    selectDocument(current.uid)

    const cached =
      getDocumentCache(current.uid) || createDocumentCache(current.uid)

    update((store: DocumentStoreInterface) => ({
      ...store,
      collection: [{ ...current }, ...store.collection],
      current,
      cached,
    }))
  }

  function updateCurrentDocument(current: DocumentModelType): void {
    if (Object.prototype.hasOwnProperty.call(current, 'error')) {
      console.error('updateCurrentDocument:', current)
      return
    }

    update((store: DocumentStoreInterface) => ({
      ...store,
      current: {
        ...store.current,
        ...current,
      },
    }))
  }

  function createDocument(
    payload?: Pick<CreateDocumentParamType, 'location' | 'data'>,
  ): void {
    const workspaceId = session.getItem(`${namespace}:current_workspace`)
    worker.postMessage({
      type: 'create',
      payload: {
        workspaceId,
        location: payload ? payload.location : 'local',
        data: payload ? payload.data : undefined,
      },
    })
  }

  function updateDocument(
    payload: DocumentModelType | Partial<DocumentModelType>,
  ): void {
    worker.postMessage({ type: 'update', payload })
  }

  function setUpdatedDocument(current: DocumentModelType): void {
    update((store: DocumentStoreInterface) => {
      const currentIndex = [...store.collection].findIndex(
        (item) => item.uid === current.uid,
      )

      const collection = [...store.collection]
      collection.splice(currentIndex, 1, { ...current, files: undefined })

      return {
        ...store,
        collection,
        current: {
          ...store.current,
          current,
        },
      }
    })
  }

  function removeDocument(payload: string): void {
    cache.removeItem(`${namespace}:${payload}`)
    worker.postMessage({ type: 'remove', payload })

    update((store: DocumentStoreInterface) => {
      const currentIndex = [...store.collection].findIndex(
        (item) => item.uid === payload,
      )

      const collection = [...store.collection]
      collection.splice(currentIndex, 1)

      const current =
        store.current && store.current.uid === payload ? null : store.current

      if (payload === store.selected) {
        session.removeItem(`${namespace}:active_document`)
      }

      return {
        ...store,
        collection,
        current,
      }
    })
  }

  function duplicateDocument(payload: DocumentModelType): void {
    worker.postMessage({ type: 'duplicate', payload })
  }

  function createFile(payload: CreateFileType): void {
    worker.postMessage({ type: 'fileCreate', payload })
  }

  function updateFile(payload: UpdateFileType): void {
    worker.postMessage({ type: 'fileUpdate', payload })
  }

  function deleteFile(payload: DeleteFileType): void {
    worker.postMessage({ type: 'fileDelete', payload })
  }

  function duplicateFile(payload: DuplicateFileType): void {
    console.log(payload)
    worker.postMessage({ type: 'fileDuplicate', payload })
  }

  /**
   * The event listener below acts as sort-of the reducer that receives the data
   * from the worker and applies the upates to the streo.
   */
  worker.addEventListener(
    'message',
    (event: MessageEvent<DocumentMsgEventContext>): void => {
      const { payload, type } = event.data
      switch (type) {
        case 'get':
          setCurrentDocument(payload as DocumentModelType)
          break
        case 'list':
          setDocuments(payload as SetStoreDocumentsType)
          break
        case 'create':
        case 'duplicate':
          setCurrentDocument(payload as DocumentModelType)
          break
        case 'update':
          setUpdatedDocument(payload as DocumentModelType)
          break
        case 'remove':
          break
        case 'fileCreate':
        case 'fileUpdate':
        case 'fileDelete':
        case 'fileDuplicate':
          updateCurrentDocument(payload as DocumentModelType)
          break
        default:
          return
      }
    },
  )

  return {
    subscribe,
    getDocument,
    getDocuments,
    createDocument,
    updateDocument,
    removeDocument,
    duplicateDocument,
    deSelectDocument,
    selectDocument,
    createFile,
    updateFile,
    deleteFile,
    duplicateFile,

    // localstorage cache crud
    getDocumentCache,
    createDocumentCache,
    updateDocumentCache,
    removeDocumentCache,
  }
})(documentWorker)

export default documentStore
