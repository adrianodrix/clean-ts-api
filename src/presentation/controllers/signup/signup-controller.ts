import { HttpRequest, HttpResponse, Controller, AddAccount } from './signup--controller-protocols'
import { badRequest, serverError, created } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases/authentication'

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

      const accessToken = await this.authentication.auth({ email, password })

      return created(Object.assign(account, { accessToken }))
    } catch (error) {
      return serverError(error)
    }
  }
}
