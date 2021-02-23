import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export interface LoadAccountByEmailRepo {
  load: (email: string) => Promise<AccountModel>
}
