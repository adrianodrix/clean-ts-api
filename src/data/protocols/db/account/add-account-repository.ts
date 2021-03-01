import { AccountModel, AddAccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (acoountData: AddAccountModel) => Promise<AccountModel>
}
