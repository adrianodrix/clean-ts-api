import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepo {
  loadByEmail: (email: string) => Promise<AccountModel>
}
