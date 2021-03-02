import { AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { AddAccountModel } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (acoountData: AddAccountModel) => Promise<AccountModel>
}
