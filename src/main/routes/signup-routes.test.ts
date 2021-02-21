import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import request from 'supertest'
import app from '../config/app'

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  const accountCollection = MongoHelper.getCollection('accounts')
  await (await accountCollection).deleteMany({})
})

describe('SignUp Routes', () => {
  test('should return an account on success', async () => {
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
