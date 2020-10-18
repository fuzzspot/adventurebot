import { MongoHelper } from 'MongoHelper'
import { Db } from 'mongodb'

export async function trackAttempt (userId: string): Promise<any> {
  const mongo: Db = MongoHelper.getDatabase()
  const dbObj = await mongo.collection('playing').updateOne({ _id: userId }, { $inc: { tries: 1 } })

  return dbObj
}
