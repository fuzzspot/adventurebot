import { MongoHelper } from 'MongoHelper'
import { Db } from 'mongodb'

/**
 * Insert the story into the DB
 *
 * @param _id the story ID
 * @param story the story
 * @param page the current page
 * @param text story text
 * @param options story options
 */
export async function insertStory(_id: string, story: string, page: string, script: string, text: string, options: object): Promise<any> {
    const mongo: Db = MongoHelper.getDatabase()
    const dbObj = await mongo.collection('stories').insertOne({ _id: _id, story: story, page: page, script: script, text: text, options: options })

    return dbObj
}
