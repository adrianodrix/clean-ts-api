import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/load-account-by-email-repo'
import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'

export class DbAuhentication implements Authentication {
  private readonly loadAccountByEmailRepo: LoadAccountByEmailRepo
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator

  constructor (loadAccountByEmailRepo: LoadAccountByEmailRepo, hashComparer: HashComparer, tokenGenerator: TokenGenerator) {
    this.loadAccountByEmailRepo = loadAccountByEmailRepo
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepo.load(email)
    if (account) {
      await this.hashComparer.comparer(password, account.password)
      await this.tokenGenerator.generate(account.id)
    }

    return null as any
  }
}
