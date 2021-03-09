import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repo'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const { surveyId, accountId, answer, date } = data
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const res = await surveyResultCollection.findOneAndUpdate({
      surveyId,
      accountId
    }, {
      $set: {
        answer,
        date
      }
    }, {
      upsert: true,
      returnOriginal: false
    })

    return MongoHelper.map(res.value)
  }
}
