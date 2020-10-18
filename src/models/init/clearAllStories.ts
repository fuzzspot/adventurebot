import { MongoHelper } from 'MongoHelper'
import { Db } from 'mongodb'

export async function clearAllStories (): Promise<any> {
  const mongo: Db = MongoHelper.getDatabase()
  const dbObj = await mongo.collection('stories').drop()

  return dbObj
}
