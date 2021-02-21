import { AccountModel, AddAccountModel } from '../usecases/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (acoountData: AddAccountModel) => Promise<AccountModel>
}
