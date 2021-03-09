import MockDate from 'mockdate'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import { Collection } from 'mongodb'
import env from '@/main/config/env'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { SurveyModel } from '@/domain/models/survey'

let surveyCollection, accountCollection: Collection

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    date: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
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

describe('SurveyResult Routes', () => {
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

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })

  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result whithout accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .expect(403)
    })

    it('should return 200 on save survey result success', async () => {
      const accessToken = await makeFakeAccount()
      const res = await surveyCollection.insertOne(makeFakeSurvey())
      const survey = MongoHelper.map(res.ops[0])

      await request(app)
        .put(`/api/surveys/${survey.id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })
})
