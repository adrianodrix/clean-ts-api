import MockDate from 'mockdate'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { SurveyMongoRepository } from './survey-mongo-repository'
import { SurveyModel } from '@/domain/models/survey'

let surveyCollection: Collection

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      date: new Date(),
      answers: [
        {
          image: 'any_image',
          answer: 'any_ansser'
        }
      ]
    },
    {
      id: 'other_id',
      question: 'other_question',
      date: new Date(),
      answers: [
        {
          image: 'other_image',
          answer: 'other_ansser'
        },
        {
          answer: 'one_more_ansser'
        }
      ]
    }
  ]
}

const makeSut = (): SurveyMongoRepository => {
  return new SurveyMongoRepository()
}

const makeFakeSurvey = (): AddSurveyParams => ({
  question: 'any_question',
  date: new Date(),
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }]
})

describe('Survey Mongo Repository', () => {
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
    await surveyCollection.deleteMany({})
  })

  describe('Add()', () => {
    test('should return an survey on add success', async () => {
      const sut = makeSut()
      await sut.add(makeFakeSurvey())
      const surveyResponse = await surveyCollection.findOne({ question: 'any_question' })

      expect(surveyResponse).toBeTruthy()
    })

    test('should throw if AddSurveyRepository throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'add').mockRejectedValue(new Error())
      const promise = sut.add(makeFakeSurvey())
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadAll()', () => {
    test('should load all surveys on success', async () => {
      await surveyCollection.insertMany(makeFakeSurveys())

      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].id).toBeTruthy()
      expect(surveys[0].question).toBe('any_question')
      expect(surveys[1].question).toBe('other_question')
    })

    test('should load empty list surveys', async () => {
      const sut = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })

    test('should throw if LoadSurveyRepository throws', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'loadAll').mockRejectedValue(new Error())
      const promise = sut.loadAll()
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadById()', () => {
    test('should load a survey by Id on success', async () => {
      const res = await surveyCollection.insertOne(makeFakeSurveys()[0])
      const sut = makeSut()
      const survey = await sut.loadById(res.ops[0]._id)
      expect(survey).toBeTruthy()
    })
  })
})
