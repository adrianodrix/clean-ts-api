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
      expect(surveryResult.answer).toBe('any_answer')
    })

    test('should update survey result it its not new', async () => {
      const sut = makeSut()
      const surveryResult1 = await sut.save(await makeFakeSurveyResult())
      const surveryResult2 = await sut.save(Object.assign({}, surveryResult1, { answer: 'other_ansser' }))

      expect(surveryResult1.id).toEqual(surveryResult2.id)
      expect(surveryResult2.answer).toBe('other_ansser')
    })
  })
})
