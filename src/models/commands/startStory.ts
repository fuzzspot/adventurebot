import { MongoHelper } from 'MongoHelper'
import { Db } from 'mongodb'

/**
 * Track which story / page the user is on
 *
 * @param userId user
 * @param story story id
 */
export async function startStory(userId: string, story: string): Promise<any> {
    const mongo: Db = MongoHelper.getDatabase()
    const dbObj = await mongo.collection('playing').updateOne({ _id: userId }, { $set: { story: story, tries: 0 } }, { upsert: true })

    return dbObj
}
