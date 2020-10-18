import { MongoHelper } from 'MongoHelper'
import { Db } from 'mongodb'

/**
 * Insert new user into database
 *
 * @param {String} userId the userId
 * @param {Date} added the date the role was aded
 */
export async function insertStory (_id: string, story: string, page: string, text: string, options: object): Promise<any> {
  const mongo: Db = MongoHelper.getDatabase()
  const dbObj = await mongo.collection('stories').insertOne({ _id: _id, story: story, page: page, text: text, options: options })

  return dbObj
}
