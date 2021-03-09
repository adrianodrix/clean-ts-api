import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases/account/add-account'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/account/load-account-by-email-repo'
import { UpdateAccessTokenRepo } from '@/data/protocols/db/account/update-access-token-repository'
import { LoadAccountByTokenRepo } from '@/data/protocols/db/account/load-account-by-token-repo'

export class AccountMongoRepository implements
  AddAccountRepository,
  LoadAccountByEmailRepo,
  UpdateAccessTokenRepo,
  LoadAccountByTokenRepo {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const result = await accountCollection.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const account = await accountCollection.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return account && MongoHelper.map(account)
  }
}
