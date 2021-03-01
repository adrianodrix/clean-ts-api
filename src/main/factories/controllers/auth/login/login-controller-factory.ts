import { LoginController } from '@/presentation/controllers/auth/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { makeLoginValidation } from '@/main/factories/controllers/auth/login/login-validation-factory'
import { makeDbAuthentication } from '@/main/factories/use-cases/auth/db-authentication-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDbAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
