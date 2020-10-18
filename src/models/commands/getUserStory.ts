import { MongoHelper } from 'MongoHelper'
import { Db } from 'mongodb'

/**
 * Get the current story / page the user is on
 *
 * @param _id user id
 */
export async function getUserStory (_id: string): Promise<any> {
  const mongo: Db = MongoHelper.getDatabase()
  const dbObj = await mongo.collection('playing').findOne({ _id: _id })

  if (dbObj === null || dbObj === undefined) {
    throw new Error('User story progress not found')
  }

  return dbObj
}
