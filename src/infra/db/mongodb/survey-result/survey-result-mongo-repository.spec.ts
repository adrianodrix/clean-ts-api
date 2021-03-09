import MockDate from 'mockdate'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SaveSurveyResultModel } from '@/domain/usecases/survey/save-survey-result'
import { AccountModel } from '@/domain/models/account'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne({
    id: 'any_id',
    question: 'any_question',
    date: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'any_ansser'
      }
    ]
  })
  return res.ops[0]
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne({
    name: 'any_name',
    email: 'any_@mail.com',
    password: 'any_password'
  })
  return res.ops[0]
}

const makeFakeSurveyResult = async (): Promise<SaveSurveyResultModel> => {
  const survey = MongoHelper.map(await makeSurvey())
  const account = MongoHelper.map(await makeAccount())

  return {
    surveyId: survey.id,
    accountId: account.id,
    answer: survey.answers[0].answer,
    date: new Date()
  }
}

describe('Survey Results Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    surveyResultCollection = await MongoHelper.getCollection('surveyResults')
    accountCollection = await MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    await surveyResultCollection.deleteMany({})
    await accountCollection.deleteMany({})
  })

  describe('Save()', () => {
    test('should return a survey result it its new', async () => {
      const sut = makeSut()
      const surveryResult = await sut.save(await makeFakeSurveyResult())
      expect(surveryResult).toBeTruthy()
      expect(surveryResult.id).toBeTruthy()
      expect(surveryResult.answer).toBe('any_ansser')
    })
  })
})
