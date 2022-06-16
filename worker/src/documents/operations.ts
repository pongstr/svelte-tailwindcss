import stringLength from 'string-length'
import type { CustomWorker } from '../main.d'
import type {
  DocumentErrorType,
  DocumentModelType,
  DocumentModelCollectionType,
  DocumentFileCollectionType,
  DocumentMessageResponseType,
  DocumentOperationsFnType,
  GetDocumentQueryType,
  GetDocumentsQueryType,
  CreateDocumentParamType,
  DocumentFileModelType,
  CreateFileType,
  UpdateFileType,
  DeleteFileType,
  DuplicateFileType,
} from './types.d'

/**
 * @function fileNameOccurence
 * @param
 * @returns
 */
function fileNameOccurence(
  filesObject: Record<string, DocumentFileModelType>,
  fileName: string,
): number {
  if (Object.keys(filesObject).length === 0) return 0
  const filename = fileName.split('.')
  return Object.keys(filesObject)
    .map((name) => {
      const fname = name.split('.')
      const matched = fname[0].match(new RegExp(`${filename[0]}`, 'gi'))
      return matched && matched.length > 0 ? 1 : null
    })
    .filter((item) => item !== null).length
}

/**
 * @function fileNameOccurenceFormat
 * @param
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fileNameOccurenceFormat(filename: string, occurence: number): string {
  const isCopy = new RegExp('^(.*?(-copy|-copy-)[^$]*)$')
  let fname = ''
  const filenameArr = filename.split('.')

  if (isCopy.test(filename)) {
    if (/\d+$/g.test(filenameArr[0])) {
      const count = filenameArr[0].match(/\d+$/g)

      fname =
        count && count.length > 0
          ? filenameArr[0].replace(/\d+$/g, String(parseInt(count[0]) + 1))
          : filenameArr[0].replace(/\d+$/g, String(occurence))

      filenameArr.splice(0, 1, fname)
      return filenameArr.join('.')
    }

    fname = [filenameArr[0], occurence].join('-')
    filenameArr.splice(0, 1, fname)
    return filenameArr.join('.')
  }

  fname =
    occurence > 1
      ? [filenameArr[0], `-copy-${occurence - 1}`].join('')
      : [filenameArr[0], `-copy`].join('')

  filenameArr.splice(0, 1, fname)
  return filenameArr.join('.')
}

function createCollectionModel(
  document: DocumentModelType,
): DocumentModelCollectionType {
  const doc = { ...document }
  let files: Record<string, DocumentFileCollectionType> | undefined

  if (!doc.files) {
    return { ...doc, files }
  }

  if (doc.files && Object.keys(doc.files).length > 0) {
    const arrFiles = Object.keys(doc.files)
      .map((file: string): [string, DocumentFileCollectionType] | [] => {
        if (doc.files && doc.files[file]) {
          const nfile: Omit<DocumentFileModelType, 'content'> & {
            content?: string
          } = {
            ...doc.files[file],
          }

          if (nfile.content) {
            delete nfile.content
          }

          return [file, nfile]
        }

        return []
      })
      .filter((i) => i.length > 0)

    files = Object.fromEntries(arrFiles) || undefined
  }

  return { ...doc, files }
}

/**
 * @exports DocumentOperations
 * @summary
 * @param worker
 * @returns {Object<OperationsFnType>}
 */
export default function operations(
  wrkr: CustomWorker,
): DocumentOperationsFnType {
  const DocumentsDB = new wrkr.PouchDB<DocumentModelType>('docs', {
    adapter: 'idb',
    auto_compaction: true,
  })

  const model = (
    opts: CreateDocumentParamType & { uid: string },
  ): DocumentModelType => ({
    _id: opts.uid,
    uid: opts.uid,
    location: opts.location || 'local',
    name: '',
    description: '',
    workspaceId: opts.workspaceId,
    createdAt: new Date(),
    updatedAt: null,
    active: true,
    size: 0,
    fileCount: 0,
    tags: [],
  })

  const fileTemplate = (
    data?: DocumentFileModelType,
  ): DocumentFileModelType => ({
    filename: 'Untitled.txt',
    description: '',
    category: 'code',
    type: 'text/plain',
    language: 'text',
    content: '',
    ...data,
    createdAt: new Date(),
    updatedAt: null,
  })

  /**
   * @function getDocumentsInfo
   * @summary
   * @returns {Promise<PouchDB.Core.DatabaseInfo | DocumentErrorType>}
   */
  async function getDocumentsInfo(): Promise<
    PouchDB.Core.DatabaseInfo | DocumentErrorType
  > {
    try {
      const response = await DocumentsDB.info()
      return response
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function getDocument
   * @summary
   * @param {Object<GetDocumentQueryType>} opts
   * @returns {Promise<DocumentModelType | DocumentErrorType>}
   */
  async function getDocument(
    opts: GetDocumentQueryType,
  ): Promise<DocumentModelType | DocumentErrorType> {
    try {
      const doc = await DocumentsDB.get(opts.uid, { latest: true })
      return doc
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function getDocuments
   * @summary
   * @param {Object<GetDocumentQueryType>} opts
   * @returns {Promise<Partial<DocumentModelType>[] | DocumentErrorType>}
   */
  async function getDocuments(
    opts: GetDocumentsQueryType,
  ): Promise<DocumentModelCollectionType[] | DocumentErrorType> {
    try {
      await DocumentsDB.createIndex({
        index: {
          fields: [
            'createdAt',
            'updatedAt',
            'workspaceId',
            'location',
            'active',
          ],
        },
      })

      const queried = await DocumentsDB.find({
        selector: {
          createdAt: { $exists: true },
          updatedAt: { $exists: true },
          workspaceId: { $eq: opts.workspaceId },
          location: { $eq: opts.location },
          active: { $eq: opts.active },
        },
        sort: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
      })

      const docs = queried.docs
        .map(createCollectionModel)
        .map((doc: DocumentModelCollectionType) => ({
          ...doc,
          size: doc.files ? stringLength(JSON.stringify(doc.files)) : 0,
          fileCount: doc.files ? Object.keys(doc.files).length : 0,
        }))
      return docs
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function createDocument
   * @summary
   * @param {Object<CreateDocumentParamType>} opts
   * @returns {Promise<DocumentModelType>}
   */
  async function createDocument(
    opts: CreateDocumentParamType,
  ): Promise<DocumentModelType | DocumentErrorType> {
    const { data, workspaceId, location } = opts
    let documentName = 'Untitled'

    if (data && data._id) {
      delete data._id
      delete data._rev
    }

    if (data && data.name) {
      documentName = data.name
    }

    try {
      const uid = wrkr.uuid.generate()
      const getCollection =
        ((await getDocuments({
          workspaceId: workspaceId,
          location: location || 'local',
          active: true,
        })) as DocumentModelType[]) || []

      const regexname = new RegExp(`${documentName}`, 'gi')
      const getOccurence = [...getCollection]
        .map((item) => item.name)
        .map((item) => {
          const matched = item.match(regexname)
          return matched && matched.length > 0 ? 1 : null
        })
        .filter((item) => item !== null).length

      const template = model({
        uid,
        location: location || 'local',
        workspaceId,
      })
      const created = await DocumentsDB.post<DocumentModelType>({
        ...template,
        name:
          getOccurence > 0 ? `${documentName}-${getOccurence}` : documentName,
        files: data && data.files ? data.files : undefined,
      })

      const doc = await DocumentsDB.get(created.id, {
        latest: true,
      })
      return doc
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function updateDocument
   * @summary
   * @param {Object<DocumentModelType>} data
   * @returns {Promise<DocumentModelType>}
   */
  async function updateDocument(
    data: DocumentModelType,
  ): Promise<DocumentModelType | DocumentErrorType> {
    try {
      const current = await DocumentsDB.get(data._id)
      const updated = await DocumentsDB.put({
        ...current,
        ...data,
        updatedAt: new Date(),
      })

      const document = await DocumentsDB.get(updated.id, { latest: true })
      return document
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function renameDocument
   * @summary
   * @param {string} id
   * @returns {Promise<DocumentMessageResponseType | DocumentErrorType>}
   */
  async function removeDocument(
    id: string,
  ): Promise<DocumentMessageResponseType | DocumentErrorType> {
    try {
      const doc = await DocumentsDB.get(id, { latest: true })
      doc.active = false
      doc.updatedAt = new Date()
      await DocumentsDB.put(doc)
      return {
        name: 'Document Deleted',
        message: `'${doc.name} (${doc.uid})' has been deleted`,
      }
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function duplicateDocument
   * @summary
   * @param {Object<DocumentModelType>} data
   * @returns {Promise<DocumentMessageResponseType | DocumentErrorType>}
   */
  async function duplicateDocument(
    data: DocumentModelType,
  ): Promise<DocumentModelType | DocumentErrorType> {
    const create = { ...data }
    create.name = `${data.name} Copy`

    try {
      const copyFrom = (await getDocument({
        uid: create.uid,
        location: create.location,
      })) as DocumentModelType

      const created = await createDocument({
        workspaceId: data.workspaceId,
        location: data.location,
        data: { ...create, files: copyFrom.files || {} },
      })

      console.log(created)

      return {
        ...created,
        fileCount: copyFrom.files ? Object.keys(copyFrom.files).length : 0,
      }
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function createFile
   * @summary a function that inserts a file inside a document
   * @param {Object<CreateFileType>} opts
   * @returns {Promise<DocumentModelType | DocumentErrorType>}
   */
  async function createFile(
    opts: CreateFileType,
  ): Promise<DocumentModelType | DocumentErrorType> {
    const data =
      {
        ...fileTemplate(),
        ...opts.data,
      } || fileTemplate()

    try {
      const doc = (await DocumentsDB.get<DocumentModelType>(opts.docId, {
        latest: true,
      })) as DocumentModelType

      if (!doc.files) {
        doc.files = {
          [data.filename]: { ...data },
        }

        const updatedDoc = await updateDocument(doc)
        return updatedDoc as DocumentModelType
      }

      const occurence = fileNameOccurence(doc.files, data.filename)
      const filename =
        occurence > 0
          ? data.filename.replace(/^([^.]+)/g, `$&-${occurence}`)
          : data.filename

      doc.files = {
        ...doc.files,
        [filename]: {
          ...data,
          filename,
        },
      }

      const updatedDoc = await updateDocument(doc)
      return updatedDoc as DocumentModelType
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function updateFile
   * @summary a function that updates a file inside a document
   * @param {Object<CreateFileType>} opts
   * @returns {Promise<DocumentModelType | DocumentErrorType>}
   */
  async function updateFile(
    opts: UpdateFileType,
  ): Promise<DocumentModelType | DocumentErrorType> {
    const { docId, data } = opts
    try {
      const doc = (await DocumentsDB.get<DocumentModelType>(docId, {
        latest: true,
      })) as DocumentModelType
      doc.updatedAt = new Date()

      if (
        !doc.files ||
        !Object.prototype.hasOwnProperty.call(doc.files, data.filename)
      ) {
        const err = new Error('The file does not exists in the document')
        return err as DocumentErrorType
      }

      doc.files[data.filename] = {
        ...data,
        updatedAt: new Date(),
      }

      const updatedDoc = await updateDocument(doc)
      return updatedDoc as DocumentModelType
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function updateFile
   * @summary a function that deletes a file inside a document
   * @param {Object<DeleteFileType>} opts
   * @returns {Promise<DocumentModelType | DocumentErrorType>}
   */
  async function deleteFile(
    opts: DeleteFileType,
  ): Promise<DocumentModelType | DocumentErrorType> {
    try {
      const doc = await DocumentsDB.get<DocumentModelType>(opts.docId, {
        latest: true,
      })

      if (
        !doc.files ||
        !Object.prototype.hasOwnProperty.call(doc.files, opts.filename)
      ) {
        const err = new Error('The file does not exists in the document')
        return err as DocumentErrorType
      }

      delete doc.files[opts.filename]

      const updated = await updateDocument(doc)

      return updated
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  /**
   * @function duplicateFile
   * @summary a function that duplicates an existing file inside a document
   * @param {Object<DeleteFileType>} opts
   * @returns {Promise<DocumentModelType | DocumentErrorType>}
   */
  async function duplicateFile(
    opts: DuplicateFileType,
  ): Promise<DocumentModelType | DocumentErrorType> {
    try {
      const doc = await DocumentsDB.get(opts.docId, { latest: true })

      if (!doc.files) {
        return doc
      }

      const original = doc.files[opts.filename]
      const duplicate = fileNameOccurenceFormat(
        opts.filename,
        fileNameOccurence(doc.files, opts.filename),
      )

      doc.files = {
        ...doc.files,
        [duplicate]: {
          ...original,
          filename: duplicate,
        },
      }

      const updated = await updateDocument(doc)
      return updated
    } catch (error: unknown) {
      return error as DocumentErrorType
    }
  }

  return {
    getDocumentsInfo,
    getDocument,
    getDocuments,
    createDocument,
    updateDocument,
    removeDocument,
    duplicateDocument,
    createFile,
    updateFile,
    deleteFile,
    duplicateFile,
  }
}
