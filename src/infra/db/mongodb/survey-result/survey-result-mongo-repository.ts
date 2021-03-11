import { ObjectId } from 'mongodb'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repo'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { MongoHelper } from '../helpers/mongo-helper'
import { loadSurveyByIdCriteria } from './criterias/load-survey-by-id-criteria'
import { LoadSurveyResultRepo } from '@/data/protocols/db/survey-result/load-survey-result-repo'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository, LoadSurveyResultRepo {
  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const { surveyId, accountId, answer, date } = data
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    await surveyResultCollection.findOneAndUpdate({
      surveyId: new ObjectId(surveyId),
      accountId: new ObjectId(accountId)
    }, {
      $set: {
        answer,
        date
      }
    }, {
      upsert: true
    })

    return await this.loadBySurveyId(surveyId)
  }

  async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
    const surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    const surveyResult = await surveyResultCollection
      .aggregate(loadSurveyByIdCriteria(surveyId))
      .toArray()
    return surveyResult.length && surveyResult[0]
  }
}
