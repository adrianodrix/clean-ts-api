import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccountModel } from '../controllers/auth/signup/signup--controller-protocols'
import { ServerError } from '../errors'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

class LoadAccountByTokenStub implements LoadAccountByToken {
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    return new Promise(resolve => resolve(makeFakeAccount()))
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
  accessToken: 'any_token'
})

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return {
    sut,
    loadAccountByTokenStub
  }
}

const makeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

describe('Auth Middleware', () => {
  test('should call load account by token with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('should return 403 if no x-access-token is found exists in headers', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle({})
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 403 if loadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpReponse = await sut.handle(makeHttpRequest())
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should return 500 if loadAccountByToken throw', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpReponse = await sut.handle(makeHttpRequest())
    expect(httpReponse).toEqual(serverError(new ServerError('')))
  })

  test('should return 200 if loadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle(makeHttpRequest())
    expect(httpReponse).toEqual(ok({ accountId: 'valid_id' }))
  })
})
