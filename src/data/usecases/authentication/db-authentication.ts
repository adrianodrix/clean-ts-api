import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/load-account-by-email-repo'
import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'
import { UpdateAccessTokenRepo } from '@/data/protocols/db/update-access-token-repository'

export class DbAuhentication implements Authentication {
  private readonly loadAccountByEmailRepo: LoadAccountByEmailRepo
  private readonly hashComparer: HashComparer
  private readonly encrypter: Encrypter
  private readonly updateAccessTokenRepo: UpdateAccessTokenRepo

  constructor (
    loadAccountByEmailRepo: LoadAccountByEmailRepo,
    hashComparer: HashComparer,
    encrypter: Encrypter,
    updateAccessTokenRepo: UpdateAccessTokenRepo
  ) {
    this.loadAccountByEmailRepo = loadAccountByEmailRepo
    this.hashComparer = hashComparer
    this.encrypter = encrypter
    this.updateAccessTokenRepo = updateAccessTokenRepo
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepo.load(email)
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
