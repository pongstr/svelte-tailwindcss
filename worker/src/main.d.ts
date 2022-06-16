import type PouchDB from 'pouchdb'
import type shortUUID from 'short-uuid'

export interface CustomWorker extends Worker {
  name: string
  PouchDB: typeof PouchDB
  uuid: typeof shortUUID
}
