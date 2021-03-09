import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/account/load-account-by-email-repo'
import { Authentication, AuthenticationParams } from '@/domain/usecases/auth/authentication'
import { UpdateAccessTokenRepo } from '@/data/protocols/db/account/update-access-token-repository'

export class DbAuhentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepo: LoadAccountByEmailRepo,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepo: UpdateAccessTokenRepo
  ) {}

  async auth (authentication: AuthenticationParams): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepo.loadByEmail(email)
    if (!account) return null as any

    const isValid = await this.hashComparer.comparer(password, account.password)
    if (!isValid) return null as any

    const accessToken = await this.encrypter.encrypt(account.id)
    if (!accessToken) return null as any

    await this.updateAccessTokenRepo.updateAccessToken(account.id, accessToken)
    return accessToken
  }
}
