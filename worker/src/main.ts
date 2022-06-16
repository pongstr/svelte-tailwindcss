import PouchDB from 'pouchdb'
import PouchDBFind from 'pouchdb-find'
import ShortUUID from 'short-uuid'
import { CustomWorker } from './main.d'

const worker = self as unknown as CustomWorker

PouchDB.plugin(PouchDBFind)
ShortUUID(ShortUUID.constants.flickrBase58)

worker.name = 'codecrumble'
worker.PouchDB = PouchDB
worker.uuid = ShortUUID
