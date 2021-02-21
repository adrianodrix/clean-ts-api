import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository } from '@/data/protocols/add-account-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases/add-account'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = MongoHelper.getCollection('accounts')
    const result = await (await accountCollection).insertOne(accountData)
    const account = result.ops[0]
    const { _id, ...accountWithoudId } = account
    return Object.assign({}, accountWithoudId, { id: _id })
  }
}
