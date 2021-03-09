import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/account/load-account-by-email-repo'
import { AccountModel, Hasher } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { AddAccount, AddAccountParams } from '@/domain/usecases/account/add-account'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepo
  ) {}

  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountExists = await this.loadAccountByEmailRepo.loadByEmail(accountData.email)
    if (accountExists) return null as any

    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add(Object.assign({}, accountData, {
      password: hashedPassword
    }))
    return account
  }
}
