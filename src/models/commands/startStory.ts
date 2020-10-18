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
  const dbObj = await mongo.collection('playing').insertOne({ userId: userId, story: story })

  return dbObj
}