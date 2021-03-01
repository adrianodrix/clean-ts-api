import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import { Collection } from 'mongodb'

let surveyCollection: Collection

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

describe('POST /surveys', () => {
  test('should return 403 when add a survey whithout accessToken', async () => {
    await request(app)
      .post('/api/surveys')
      .send({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }]
      })
      .expect(403)
  })

  test('should return 204 when add a survey', async () => {
    await request(app)
      .post('/api/surveys')
      .send({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }, {
          answer: 'other_answer'
        }]
      })
      .expect(204)

    const surveyResponse = await surveyCollection.findOne({ question: 'any_question' })
    expect(surveyResponse).toBeTruthy()
  })
})
