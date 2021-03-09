import { AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { AddAccountParams } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (acoountData: AddAccountParams) => Promise<AccountModel>
}
