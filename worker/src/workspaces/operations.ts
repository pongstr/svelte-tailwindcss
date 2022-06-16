import { CustomWorker } from '../main.d'
import {
  WorkspacesModelType,
  WorkspaceMessageResponseType,
  WorkspaceErrorType,
  WorkspaceOperationsFnType,
} from './types.d'

/**
 * @exports WorkspaceOperations
 * @summary
 * @param worker
 * @returns {Object<OperationsFnType>}
 */
export default function operations(
  wrkr: CustomWorker,
): WorkspaceOperationsFnType {
  const WorkspaceDB = new wrkr.PouchDB<WorkspacesModelType>('workspace', {
    adapter: 'idb',
    auto_compaction: true,
    revs_limit: 1,
  })

  function getDocument(workspace: WorkspacesModelType): WorkspacesModelType {
    const { avatar, _attachments, _id } = workspace
    const doc = { ...workspace }

    const filename = avatar.filename
    let content = avatar.content

    if (
      filename &&
      filename.trim() !== '' &&
      _attachments &&
      Object.prototype.hasOwnProperty.call(_attachments, filename)
    ) {
      content = atob(_attachments[filename].data)
    }

    return {
      ...doc,
      uid: _id,
      avatar: {
        filename,
        content,
      },
    }
  }

  const model = (uuid: string): WorkspacesModelType => ({
    _id: uuid,
    uid: uuid,
    name: '',
    avatar: {
      filename: '',
      content: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    description: '',
    active: true,
    default: false,
    editor: {
      autoClosingBrackets: 'always',
      autoClosingDelete: 'auto',
      autoClosingOvertype: 'auto',
      autoClosingQuotes: 'always',
      autoIndent: 'brackets',
      dragAndDrop: true,
      emptySelectionClipboard: false,
      folding: true,
      foldingHighlight: true,
      foldingStrategy: 'auto',
      fontFamily: "Consolas, Menlo, 'Courier New', monospace",
      fontSize: 14,
      lineHeight: 20,
      contextmenu: false,
      matchBrackets: 'always',
      guides: {
        bracketPairs: true,
        highlightActiveIndentation: true,
        indentation: true,
      },
      minimap: {
        enabled: false,
        maxColumn: 100,
        renderCharacters: false,
        scale: 1,
        side: 'right',
        showSlider: 'always',
        size: 'proportional',
      },
    },
    location: {
      github: {
        name: 'github',
        token: '',
        enabled: false,
      },
      gitlab: {
        name: 'gitlab',
        token: '',
        enabled: false,
      },
      bitbucket: {
        name: 'bitbucket',
        token: '',
        enabled: false,
      },
    },
    theme: 'dark',
    dashboard: {
      view: 'grid',
      sort: 'desc',
      workspaces: true,
    },
    setttingsPage: {
      currentTab: 'workspace',
    },
  })

  /**
   * @function getWorkspaceInfo
   * @summary
   * @returns {Promise<PouchDB.Core.DatabaseInfo | WorkspaceErrorType>}
   */
  async function getWorkspaceInfo(): Promise<
    PouchDB.Core.DatabaseInfo | WorkspaceErrorType
  > {
    try {
      const response = await WorkspaceDB.info()
      return response
    } catch (error: unknown) {
      return error as WorkspaceErrorType
    }
  }

  /**
   * @function getWorkspace
   * @summary
   * @param {string} id
   * @returns {Promise<WorkspacesModelType[]>}
   */
  async function getWorkspace(
    id: string,
  ): Promise<WorkspacesModelType | WorkspaceErrorType> {
    if (!id) {
      return {
        name: 'parameter ID value is missing',
        message: 'A required parameter is missing.',
      } as WorkspaceErrorType
    }

    try {
      const doc = await WorkspaceDB.get<WorkspacesModelType>(id, {
        latest: true,
        attachments: true,
      })

      return { ...getDocument(doc) }
    } catch (error: unknown) {
      return error as WorkspaceErrorType
    }
  }

  /**
   * @function getWorkspaces
   * @summary
   * @returns {Promise<WorkspacesModelType[]>}
   */
  async function getWorkspaces(): Promise<
    Partial<WorkspacesModelType>[] | WorkspaceErrorType
  > {
    try {
      await WorkspaceDB.createIndex({
        index: {
          fields: ['createdAt', 'updatedAt', 'active'],
        },
      })

      const docs = await WorkspaceDB.find({
        selector: {
          createdAt: { $exists: true },
          updatedAt: { $exists: true },
          active: { $eq: true },
        },
        sort: [{ createdAt: 'desc' }, { updatedAt: 'desc' }],
      })

      const documents = Promise.all(
        [...docs.docs].map(
          async (
            doc: WorkspacesModelType,
          ): Promise<Partial<WorkspacesModelType>> => {
            const document = await WorkspaceDB.get(doc._id, {
              latest: true,
              attachments: true,
            })
            const {
              _id,
              uid,
              name,
              active,
              description,
              avatar,
              createdAt,
              updatedAt,
            } = getDocument(document)
            return {
              _id,
              uid,
              name,
              active,
              default: doc.default,
              description,
              avatar,
              createdAt,
              updatedAt,
            }
          },
        ),
      )

      return documents
    } catch (error: unknown) {
      return error as WorkspaceErrorType
    }
  }

  /**
   * @function createWorkspace
   * @summary
   * @param {Object<Partial<WorkspacesModelType>>}
   * @returns {Promise<WorkspaceErrorType | WorkspacesModelType>}
   */
  async function createWorkspace(
    data?: Partial<WorkspacesModelType> | undefined,
  ): Promise<WorkspacesModelType | WorkspaceErrorType> {
    let documentName = 'Workspace'

    if (data && data._id) {
      delete data._id
      delete data._rev
    }

    if (data && data.name) {
      documentName = data.name.trim() === '' ? documentName : data.name
    }

    try {
      const getCollection = (await getWorkspaces()) as WorkspacesModelType[]
      const regexname = new RegExp(`${documentName}`, 'gi')
      const getOccurence = [...getCollection]
        .map((item) => item.name)
        .map((item) => {
          const matched = item.match(regexname)
          return matched && matched.length > 0 ? 1 : null
        })
        .filter((item) => item !== null).length

      const template = !data
        ? { ...model(wrkr.uuid.generate()) }
        : { ...model(wrkr.uuid.generate()), ...data }
      const created = await WorkspaceDB.post<WorkspacesModelType>({
        ...template,
        _id: template._id,
        name:
          getOccurence > 0 ? `${documentName}-${getOccurence}` : documentName,
        default: getCollection.length === 0,
      })
      const createDocument = await WorkspaceDB.get<WorkspacesModelType>(
        created.id,
        {
          latest: true,
        },
      )
      return { ...getDocument(createDocument) }
    } catch (error: unknown) {
      return error as WorkspaceErrorType
    }
  }

  /**
   * @function updateWorkspace
   * @summary
   * @param
   * @returns
   */
  async function updateWorkspace(
    data: WorkspacesModelType,
  ): Promise<WorkspacesModelType | WorkspaceErrorType> {
    try {
      await WorkspaceDB.put<WorkspacesModelType>({
        ...data,
        avatar: {
          filename: data.avatar.filename,
          content: '',
        },
        updatedAt: new Date(),
      })

      const doc = await WorkspaceDB.get<WorkspacesModelType>(data._id, {
        latest: true,
        attachments: true,
      })

      return { ...getDocument(doc) }
    } catch (error: unknown) {
      return error as WorkspaceErrorType
    }
  }

  /**
   * @function removeWorkspace
   * @summary
   * @param
   * @returns
   */
  async function removeWorkspace(
    id: string,
  ): Promise<WorkspaceMessageResponseType | WorkspaceErrorType> {
    try {
      const workspaceDocument = await WorkspaceDB.get<WorkspacesModelType>(id)
      await WorkspaceDB.remove(workspaceDocument)
      return { name: 'DeleteWorkspace', message: `${id} Successfully removed` }
    } catch (error: unknown) {
      return error as WorkspaceErrorType
    }
  }

  return {
    getWorkspaceInfo,
    getWorkspace,
    getWorkspaces,
    createWorkspace,
    updateWorkspace,
    removeWorkspace,
  }
}
