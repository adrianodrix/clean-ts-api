import MockDate from 'mockdate'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultMongoRepository } from './survey-result-mongo-repository'
import { SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { AccountModel } from '@/domain/models/account'
import { mockAddAccountParams, mockAddSurveyParams } from '@/domain/test'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSut = (): SurveyResultMongoRepository => {
  return new SurveyResultMongoRepository()
}

const makeSurvey = async (): Promise<SurveyModel> => {
  const res = await surveyCollection.insertOne(mockAddSurveyParams())
  return MongoHelper.map(res.ops[0])
}

const makeAccount = async (): Promise<AccountModel> => {
  const res = await accountCollection.insertOne(mockAddAccountParams())
  return MongoHelper.map(res.ops[0])
}

const makeFakeSurveyResult = async (): Promise<SaveSurveyResultParams> => {
  const survey = MongoHelper.map(await makeSurvey())
  const account = MongoHelper.map(await makeAccount())

  return {
    surveyId: survey.id,
    accountId: account.id,
    answer: survey?.answers[0].answer,
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
      const surveyParams = await makeFakeSurveyResult()
      const surveryResult = await sut.save(surveyParams)

      expect(surveryResult).toBeTruthy()
      expect(surveryResult.surveyId).toEqual(surveyParams.surveyId)
      expect(surveryResult.answers[0].count).toBe(1)
      expect(surveryResult.answers[0].percent).toBe(100)
    })

    test('should update survey result it its not new', async () => {
      const sut = makeSut()
      const survey = await makeFakeSurveyResult()
      const surveryResult1 = await sut.save(survey)
      const account = MongoHelper.map(await makeAccount())
      await sut.save({
        surveyId: survey.surveyId,
        accountId: account.id,
        answer: 'any_answer',
        date: new Date()
      })
      const surveryResult2 = await sut.save({
        surveyId: survey.surveyId,
        accountId: survey.accountId,
        answer: 'other_answer',
        date: new Date()
      })

      expect(surveryResult2).toBeTruthy()
      expect(surveryResult1?.surveyId).toEqual(surveryResult2.surveyId)
      expect(surveryResult2.answers[0].count).toBe(1)
      expect(surveryResult2.answers[0].percent).toBe(50)
      expect(surveryResult2.answers[1].count).toBe(1)
      expect(surveryResult2.answers[1].percent).toBe(50)
      expect(surveryResult2?.answers[1].answer).toBe('other_answer')
    })
  })
})
