import { LoadAccountByEmailRepo } from '@/data/protocols/load-account-by-email-repo'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuhentication } from './db-authentication'

class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepo {
  async load (email: string): Promise<AccountModel> {
    const account: AccountModel = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
    return new Promise(resolve => resolve(account))
  }
}

describe('DBAuthentication UseCase', () => {
  test('should call LoadAccountByEmailRepo with correct email', async () => {
    const loadAccountByEmailRepoStub = new LoadAccountByEmailRepoStub()
    const sut = new DbAuhentication(loadAccountByEmailRepoStub)

    const loadSpy = jest.spyOn(loadAccountByEmailRepoStub, 'load')
    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
