import { MongoHelper } from 'MongoHelper'
import { Db } from 'mongodb'

/**
 * Insert new user into database
 *
 * @param {String} userId the userId
 * @param {Date} added the date the role was aded
 */
export async function startStory (userId: string, story: string): Promise<any> {
  const mongo: Db = MongoHelper.getDatabase()
  const dbObj = await mongo.collection('playing').updateOne({ _id: userId }, { $set: { story: story, tries: 0 } }, { upsert: true })

  return dbObj
}
