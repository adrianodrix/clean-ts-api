import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden } from '../helpers/http/http-helper'
import { HttpRequest } from '../protocols'
import { AuthMiddleware } from './auth-middleware'

const makeSut = (): any => {
  const sut = new AuthMiddleware()
  return {
    sut
  }
}

const makeHttpRequest = (): HttpRequest => ({
  headers: {}
})

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token is found exists in headers', async () => {
    const { sut } = makeSut()
    const httpReponse = await sut.handle(makeHttpRequest())
    expect(httpReponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
