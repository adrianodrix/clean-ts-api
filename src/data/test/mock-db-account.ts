import { mockAccountModel } from '@/domain/test'
import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { AddAccountRepository } from '../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepo } from '../protocols/db/account/load-account-by-email-repo'
import { UpdateAccessTokenRepo } from '../protocols/db/account/update-access-token-repository'
import { AccountModel, AddAccountParams } from '../usecases/account/add-account/db-add-account-protocols'

export const mockAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (acoountData: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new AddAccountRepositoryStub()
}

export const mockLoadAccountByEmailRepo = (): LoadAccountByEmailRepo => {
  class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepo {
    async loadByEmail (email: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByEmailRepoStub()
}

export const mockLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenStub()
}

export const mockUpdateAccessTokenRepo = (): UpdateAccessTokenRepo => {
  class UpdateAccessTokenRepoStub implements UpdateAccessTokenRepo {
    async updateAccessToken (id: string, accessToken: string): Promise<void> {

    }
  }
  return new UpdateAccessTokenRepoStub()
}
