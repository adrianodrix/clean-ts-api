import { SignUpController } from '@/presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '@/data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { makeSignUpValidation } from '@/main/factories/signup/signup-validation-factory'
import { DbAuhentication } from '@/data/usecases/authentication/db-authentication'
import { Authentication } from '@/domain/usecases/authentication'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import env from '@/main/config/env'

export const makeSignUpController = (): Controller => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const hashComparer: HashComparer = new BcryptAdapter(salt)
  const encrypter: Encrypter = new JwtAdapter(env.jwtSecret)

  const authentication: Authentication = new DbAuhentication(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  )

  const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation(), authentication)
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
