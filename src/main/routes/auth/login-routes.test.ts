import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '@/main/config/app'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

let accountCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  accountCollection = await MongoHelper.getCollection('accounts')
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
      .expect(/id/)
  })
})

describe('POST /login', () => {
  test('should return 200 and a token on login', async () => {
    const password = await hash('123', 12)

    await accountCollection.insertOne({
      name: 'Adriano Santos',
      email: 'adrianodrix@gmail.com',
      password
    })

    await request(app)
      .post('/api/login')
      .send({
        email: 'adrianodrix@gmail.com',
        password: '123'
      })
      .expect(200)
      .expect(/accessToken/)
  })

  test('should return 401 on login fails', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: 'adrianodrix@gmail.com',
        password: '123'
      })
      .expect(401)
      .expect(/error/)
  })
})
