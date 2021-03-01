import { SignUpController } from '@/presentation/controllers/auth/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from '@/main/factories/controllers/auth/signup/signup-validation-factory'
import { makeDbAuthentication } from '@/main/factories/use-cases/auth/db-authentication-factory'
import { makeDbAddAccount } from '@/main/factories/use-cases/account/add-account/add-account-factory'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
