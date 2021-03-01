import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('should reconnect if mongodb is down', async () => {
    let accountColletion = await sut.getCollection('accounts')
    expect(accountColletion).toBeTruthy()

    await sut.disconnect()
    accountColletion = await sut.getCollection('accounts')
    expect(accountColletion).toBeTruthy()
  })

  test('should return id instead of _id', () => {
    expect(sut.map({ _id: 'any_id' }))
      .toEqual({ id: 'any_id' })
  })

  test('should return data when there is no id', () => {
    expect(sut.map({ any_field: 'any_value' }))
      .toEqual({ any_field: 'any_value' })
  })
})
