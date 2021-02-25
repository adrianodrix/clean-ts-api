import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { AccountModel, AddAccount, AddAccountModel, Hasher } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, {
      id: 'valid_id',
      password: hashedPassword,
      accessToken: null as any
    }))
    return account
  }
}
