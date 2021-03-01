import { AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepo {
  loadByEmail: (email: string) => Promise<AccountModel>
}
