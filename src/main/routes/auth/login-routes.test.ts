import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  const accountCollection = await MongoHelper.getCollection('accounts')
  await accountCollection.deleteMany({})
})

describe('POST /signup', () => {
  test('should return 201 and an account on signup', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Adriano Santos',
        email: 'adrianodrix@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(201)
  })
})
