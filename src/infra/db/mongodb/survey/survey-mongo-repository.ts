import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { LoadSurveysRepo } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyByIdRepo } from '@/data/protocols/db/survey/load-surveys-by-id-repository'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements
  AddSurveyRepository,
  LoadSurveysRepo,
  LoadSurveyByIdRepo {
  async add (surveyData: AddSurveyParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(surveyData)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const list = await surveyCollection.find().toArray()
    return list && MongoHelper.mapCollection(list)
  }

  async loadById (id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })
    return survey && MongoHelper.map(survey)
  }
}
