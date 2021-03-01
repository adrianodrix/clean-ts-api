import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccountModel } from '../controllers/auth/signup/signup--controller-protocols'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden } from '../helpers/http/http-helper'
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

const makeSut = (): any => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
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
  test('should return 403 if no x-access-token is found exists in headers', async () => {
    const { sut } = makeSut()
    jest.spyOn(sut, 'handle').mockReturnValueOnce(forbidden(new AccessDeniedError()))
    const httpReponse = await sut.handle(makeHttpRequest())
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call load account by token with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(makeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
