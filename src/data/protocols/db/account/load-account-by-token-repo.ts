import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'

export interface LoadAccountByTokenRepo {
  loadByToken: (token: string, role?: string) => Promise<AccountModel>
}
