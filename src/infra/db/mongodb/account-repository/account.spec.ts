import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

let accountCollection: Collection

describe('Account Mongo Repository', () => {
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

  const makeSut = (): AccountMongoRepository => {
    return new AccountMongoRepository()
  }

  const makeFakeAccount = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'valid_password'
  })

  test('should return an account on add success', async () => {
    const sut = makeSut()
    const account = await sut.add(makeFakeAccount())
    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email@mail.com')
  })

  test('should return an account on load by email success', async () => {
    const sut = makeSut()
    await accountCollection.insertOne(makeFakeAccount())
    const account = await sut.loadByEmail('valid_email@mail.com')

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('valid_name')
    expect(account.email).toBe('valid_email@mail.com')
  })

  test('should return null if on load by email fails', async () => {
    const sut = makeSut()
    await accountCollection.insertOne(makeFakeAccount())
    const account = await sut.loadByEmail('invalid_email@mail.com')

    expect(account).toBeFalsy()
  })
})
