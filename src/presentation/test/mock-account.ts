import { mockAccountModel } from '@/domain/test'
import { AccountModel, AddAccount, AddAccountParams } from '../controllers/auth/signup/signup--controller-protocols'

export const mockAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (acoount: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel())
    }
  }

  return new AddAccountStub()
}
