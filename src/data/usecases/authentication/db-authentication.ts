import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/load-account-by-email-repo'
import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'

export class DbAuhentication implements Authentication {
  private readonly loadAccountByEmailRepo: LoadAccountByEmailRepo
  private readonly hashComparer: HashComparer

  constructor (loadAccountByEmailRepo: LoadAccountByEmailRepo, hashComparer: HashComparer) {
    this.loadAccountByEmailRepo = loadAccountByEmailRepo
    this.hashComparer = hashComparer
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    const account = await this.loadAccountByEmailRepo.load(email)
    if (account) {
      await this.hashComparer.comparer(password, account.password)
    }

    return null as any
  }
}
