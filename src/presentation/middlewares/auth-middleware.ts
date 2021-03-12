import { LoadAccountByToken } from '@/domain/usecases/account/load-account-by-token'
import { JsonWebTokenError } from 'jsonwebtoken'
import { AccountModel } from '../controllers/auth/signup/signup--controller-protocols'
import { ServerError } from '../errors'
import { AccessDeniedError } from '../errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from '../protocols'
import { Middleware } from '../protocols/middleware'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (!accessToken) return forbidden(new AccessDeniedError())

      const account: AccountModel = await this.loadAccountByToken.load(accessToken, this.role)
      if (!account) return forbidden(new AccessDeniedError())

      return ok({ accountId: account.id })
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        // if the error thrown is because the JWT is unauthorized, return a 401 error
        return forbidden(new AccessDeniedError())
      }
      return serverError(new ServerError(error.stack))
    }
  }
}
