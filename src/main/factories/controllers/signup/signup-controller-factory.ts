import { SignUpController } from '@/presentation/controllers/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeSignUpValidation } from '@/main/factories/controllers/signup/signup-validation-factory'
import { makeDbAuthentication } from '@/main/factories/use-cases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '../../use-cases/add-account/add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSignUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
