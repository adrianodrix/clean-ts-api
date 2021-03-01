import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'

let surveyCollection: Collection

describe('Survey Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})
  })

  const makeSut = (): SurveyMongoRepository => {
    return new SurveyMongoRepository()
  }

  const makeFakeSurvey = (): AddSurveyModel => ({
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      answer: 'other_answer'
    }]
  })

  test('should return an survey on add success', async () => {
    const sut = makeSut()
    await sut.add(makeFakeSurvey())
    const surveyResponse = await surveyCollection.findOne({ question: 'any_question' })

    expect(surveyResponse).toBeTruthy()
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const sut = makeSut()
    jest.spyOn(sut, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.add(makeFakeSurvey())
    await expect(promise).rejects.toThrow()
  })
})
