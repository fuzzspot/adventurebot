import { MongoHelper } from 'MongoHelper'
import { Db } from 'mongodb'

export async function loadPage (_id: string): Promise<any> {
  const mongo: Db = MongoHelper.getDatabase()
  const dbObj = await mongo.collection('stories').findOne({ _id: _id })

  if (dbObj === null || dbObj === undefined) {
    throw new Error('Message not found')
  }

  return dbObj
}
