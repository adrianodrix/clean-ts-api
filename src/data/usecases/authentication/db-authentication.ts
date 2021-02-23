import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/load-account-by-email-repo'
import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'
import { UpdateAccessTokenRepo } from '@/infra/db/mongodb/account-repository/update-access-token-repository'

export class DbAuhentication implements Authentication {
  private readonly loadAccountByEmailRepo: LoadAccountByEmailRepo
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepo: UpdateAccessTokenRepo

  constructor (
    loadAccountByEmailRepo: LoadAccountByEmailRepo,
    hashComparer: HashComparer,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepo: UpdateAccessTokenRepo
  ) {
    this.loadAccountByEmailRepo = loadAccountByEmailRepo
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepo = updateAccessTokenRepo
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepo.load(email)
    if (account) {
      const isValid = await this.hashComparer.comparer(password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        if (accessToken) {
          await this.updateAccessTokenRepo.update(account.id, accessToken)
          return accessToken
        }
      }
    }
    return null as any
  }
}
