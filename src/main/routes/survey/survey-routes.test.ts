import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@/main/config/env'

let surveyCollection, accountCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  surveyCollection = await MongoHelper.getCollection('surveys')
  await surveyCollection.deleteMany({})

  accountCollection = await MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

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

    await request(app)
      .post('/api/surveys')
      .set('x-access-token', accessToken)
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
