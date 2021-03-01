import { HttpRequest, HttpResponse, Controller } from '@/presentation/controllers/auth/signup/signup--controller-protocols'
import { badRequest, serverError, created, forbidden } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases/auth/authentication'
import { EmailInUseError } from '@/presentation/errors/email-in-use-error'
import { AddAccount } from '@/domain/usecases/account/add-account'

export class SignUpController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      // create a account
      const { name, email, password } = httpRequest.body
      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const accessToken = await this.authentication.auth({ email, password })

      return created({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
