import MockDate from 'mockdate'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'
import { SurveyModel } from '@/domain/models/survey'

let surveyCollection, accountCollection: Collection

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

  accountCollection = await MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

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

const makeFakeAccount = async (): Promise<string> => {
  const password = await hash('123', 12)
  const res = await accountCollection.insertOne({
    name: 'Adriano Santos',
    email: 'adrianodrix@gmail.com',
    role: 'admin',
    password
  })

  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({
    _id: id
  }, {
    $set: {
      accessToken
    }
  })

  return accessToken
}
describe('POST /surveys', () => {
  test('should return 403 when add a survey whithout accessToken', async () => {
    await request(app)
      .post('/api/surveys')
      .expect(403)
  })

  test('should return 403, when add a survey with invalid access token', async () => {
    const accessToken = sign({ id: 'invalid_token' }, env.jwtSecret)
    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .expect(403)
  })

  test('should return 204 when add a survey with valid access token', async () => {
    const accessToken = await makeFakeAccount()

    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .send({
        question: 'any_question',
        date: new Date(),
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

describe('GET /surveys', () => {
  test('should return 403 when load all surveys whithout accessToken', async () => {
    await request(app)
      .get('/api/surveys')
      .expect(403)
  })

  test('should return 403, when load all surveys with invalid access token', async () => {
    const accessToken = sign({ id: 'invalid_token' }, env.jwtSecret)
    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
      .expect(403)
  })

  test('should return 204 when empty list of the surveys with valid access token', async () => {
    const accessToken = await makeFakeAccount()
    await request(app)
      .get('/api/surveys')
      .set('x-access-token', accessToken)
      .expect(204)
  })

  test('should return 200 when list of the surveys with valid access token', async () => {
    await surveyCollection.insertMany(makeFakeSurveys())
    const accessToken = await makeFakeAccount()
    await request(app)
      .get('/api/surveys')
      .set('x-access-token', accessToken)
      .expect(200)
  })
})
