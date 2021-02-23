import { AccountModel, AddAccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export interface AddAccountRepository {
  add: (acoountData: AddAccountModel) => Promise<AccountModel>
}
