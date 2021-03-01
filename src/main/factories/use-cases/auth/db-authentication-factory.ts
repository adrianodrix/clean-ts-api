import { Authentication } from '@/domain/usecases/auth/authentication'
import { DbAuhentication } from '@/data/usecases/auth/db-authentication'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import env from '@/main/config/env'

export const makeDbAuthentication = (): Authentication => {
  const salt = 12

  const accountMongoRepository: AccountMongoRepository = new AccountMongoRepository()
  const hashComparer: HashComparer = new BcryptAdapter(salt)
  const encrypter: Encrypter = new JwtAdapter(env.jwtSecret)

  return new DbAuhentication(
    accountMongoRepository,
    hashComparer,
    encrypter,
    accountMongoRepository
  )
}
