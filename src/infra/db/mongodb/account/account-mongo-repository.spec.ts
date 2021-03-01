import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'

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

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository()
}

const makeFakeAccount = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

describe('Account Mongo Repository ..', () => {
  describe('add()', () => {
    test('should return an account on add success', async () => {
      const sut = makeSut()
      const account = await sut.add(makeFakeAccount())

      expect(account).toBeTruthy()
      expect(account.name).toBe('valid_name')
      expect(account.email).toBe('valid_email@mail.com')
      expect(account.password).toBe('valid_password')
    })
  })

  describe('loadByEmail()', () => {
    test('should return an account on load by email success', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(makeFakeAccount())
      const account = await sut.loadByEmail('valid_email@mail.com')

      expect(account).toBeTruthy()
      expect(account.name).toBe('valid_name')
      expect(account.email).toBe('valid_email@mail.com')
      expect(account.password).toBe('valid_password')
    })

    test('should return null if on load by email fails', async () => {
      const sut = makeSut()
      await accountCollection.insertOne(makeFakeAccount())
      const account = await sut.loadByEmail('invalid_email@mail.com')

      expect(account).toBeFalsy()
    })
  })

  describe('updateAccessToken()', () => {
    test('should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut()
      const res = await accountCollection.insertOne(makeFakeAccount())
      const fakeAccount = res.ops[0]

      expect(fakeAccount.accessToken).toBeFalsy()

      await sut.updateAccessToken(fakeAccount._id, 'any_token')
      const account: AccountModel = await sut.loadByEmail('valid_email@mail.com')

      expect(account).toBeTruthy()
      expect(account.accessToken).toBe('any_token')
    })
  })

  describe('loadByToken()', () => {
    test('should return an account on load by token success whithout role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        accessToken: 'valid_token'
      })
      const account = await sut.loadByToken('valid_token')
      expect(account).toBeTruthy()
      expect(account.name).toBe('valid_name')
      expect(account.email).toBe('valid_email@mail.com')
      expect(account.password).toBe('valid_password')
    })

    test('should return an account on load by token success whith role', async () => {
      const sut = makeSut()
      await accountCollection.insertOne({
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        role: 'admin',
        accessToken: 'valid_token'
      })
      const account = await sut.loadByToken('valid_token', 'admin')
      expect(account).toBeTruthy()
      expect(account.name).toBe('valid_name')
      expect(account.email).toBe('valid_email@mail.com')
      expect(account.password).toBe('valid_password')
    })

    test('should return null if on load by token fails', async () => {
      const sut = makeSut()
      const account = await sut.loadByToken('invalid_token')
      expect(account).toBeFalsy()
    })
  })
})
