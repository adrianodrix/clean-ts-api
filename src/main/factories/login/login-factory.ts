import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from '@/presentation/controllers/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { Validation } from '@/presentation/protocols/validation'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { Authentication } from '@/domain/usecases/authentication'
import { DbAuhentication } from '@/data/usecases/authentication/db-authentication'
import { makeLoginValidation } from './login-validation-factory'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import env from '@/main/config/env'

export const makeLoginController = (): Controller => {
  const salt = 12

  const validation: Validation = makeLoginValidation()
  const logMongoRepository: LogErrorRepository = new LogMongoRepository()
  const accountMongoRepository: AccountMongoRepository = new AccountMongoRepository()
  const hashComparer: HashComparer = new BcryptAdapter(salt)
  const encrypter: Encrypter = new JwtAdapter(env.jwtSecret)

  const authentication: Authentication = new DbAuhentication(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  )

  const loginController = new LoginController(authentication, validation)
  return new LogControllerDecorator(loginController, logMongoRepository)
}
