import { AccountModel } from '../usecases/models/account'

export interface AddAccountModel {
  name: string
  email: string
  password: string
}

export interface AddAccount {
  add: (acoount: AddAccountModel) => AccountModel
}
