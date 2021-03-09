import { AccountModel } from '../models/account'
import { AddAccountParams } from '../usecases/account/add-account'
import { AuthenticationParams } from '../usecases/auth/authentication'

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), {
  id: 'any_id'
})

export const mockAuth = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
