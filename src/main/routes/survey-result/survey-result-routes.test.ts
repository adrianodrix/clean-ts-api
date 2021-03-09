import MockDate from 'mockdate'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import { Collection } from 'mongodb'

let surveyCollection, accountCollection: Collection

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
    test('should return 403 on save survey result whithout accessToken', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .expect(403)
    })
  })
})
