import { CustomWorker } from '../main.d'
import type {
  CreateDocumentParamType,
  CreateFileType,
  DeleteFileType,
  DocumentErrorType,
  DocumentModelType,
  DocumentMsgEventContext,
  DuplicateFileType,
  GetDocumentQueryType,
  GetDocumentsQueryType,
  UpdateFileType,
} from './types.d'
import operations from './operations'

self.importScripts('./main.worker.min.js')
self.name = 'codecrumble:documents'

// init documents worker
;((wrkr) => {
  const ops = operations(wrkr)

  async function getDocumentInfoFn(): Promise<void> {
    try {
      const response = await ops.getDocumentsInfo()
      wrkr.postMessage({ type: 'info', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function getDocumentFn(opts: GetDocumentQueryType): Promise<void> {
    try {
      const response = await ops.getDocument(opts)
      wrkr.postMessage({ type: 'get', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function getDocumentsFn(query: GetDocumentsQueryType): Promise<void> {
    try {
      const collection = await ops.getDocuments(query)
      const trashbin = await ops.getDocuments({
        workspaceId: query.workspaceId,
        location: query.location,
        active: false,
      })
      wrkr.postMessage({ type: 'list', payload: { collection, trashbin } })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function createDocumentFn(
    opts: CreateDocumentParamType,
  ): Promise<void> {
    try {
      const response = await ops.createDocument(opts)
      wrkr.postMessage({ type: 'create', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function updateDocumentFn(data: DocumentModelType): Promise<void> {
    try {
      const response = await ops.updateDocument(data)
      wrkr.postMessage({ type: 'update', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function removeDocumentFn(id: string): Promise<void> {
    try {
      const response = await ops.removeDocument(id)
      wrkr.postMessage({ type: 'remove', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function duplicateDocumentFn(data: DocumentModelType): Promise<void> {
    try {
      const response = await ops.duplicateDocument(data)
      wrkr.postMessage({ type: 'duplicate', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function createFileFn(opts: CreateFileType): Promise<void> {
    try {
      const response = await ops.createFile(opts)
      wrkr.postMessage({ type: 'fileCreate', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function updateFileFn(opts: UpdateFileType): Promise<void> {
    try {
      const response = await ops.updateFile(opts)
      wrkr.postMessage({ type: 'fileUpdate', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function deleteFileFn(opts: DeleteFileType): Promise<void> {
    try {
      const response = await ops.deleteFile(opts)
      wrkr.postMessage({ type: 'fileDelete', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  async function duplicateFile(opts: DeleteFileType): Promise<void> {
    try {
      const response = await ops.duplicateFile(opts)
      wrkr.postMessage({ type: 'fileDuplicate', payload: response })
    } catch (err: unknown) {
      wrkr.postMessage({ type: 'error', payload: err as DocumentErrorType })
    }
  }

  wrkr.addEventListener(
    'message',
    // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await
    async (event: MessageEvent<DocumentMsgEventContext>): Promise<void> => {
      const { payload, type } = event.data
      switch (type) {
        case 'list':
          await getDocumentsFn(payload as GetDocumentsQueryType)
          break
        case 'get':
          await getDocumentFn(payload as GetDocumentQueryType)
          break
        case 'create':
          await createDocumentFn(payload as CreateDocumentParamType)
          break
        case 'update':
          await updateDocumentFn(payload as DocumentModelType)
          break
        case 'remove':
          await removeDocumentFn(payload as string)
          break
        case 'duplicate':
          await duplicateDocumentFn(payload as DocumentModelType)
          break
        case 'fileCreate':
          await createFileFn(payload as CreateFileType)
          break
        case 'fileUpdate':
          await updateFileFn(payload as UpdateFileType)
          break
        case 'fileDelete':
          await deleteFileFn(payload as DeleteFileType)
          break
        case 'fileDuplicate':
          await duplicateFile(payload as DuplicateFileType)
          break
        default:
          await getDocumentInfoFn()
      }
    },
  )
})(self as unknown as CustomWorker)
