import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/account/load-account-by-email-repo'
import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'
import { UpdateAccessTokenRepo } from '@/data/protocols/db/account/update-access-token-repository'

export class DbAuhentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepo,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepo: UpdateAccessTokenRepo
  ) {}

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepo.loadByEmail(email)
    if (account) {
      const isValid = await this.hashComparer.comparer(password, account.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id)
        if (accessToken) {
          await this.updateAccessTokenRepo.updateAccessToken(account.id, accessToken)
          return accessToken
        }
      }
    }
    return null as any
  }
}
