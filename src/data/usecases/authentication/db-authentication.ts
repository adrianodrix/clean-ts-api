import { LoadAccountByEmailRepo } from '@/data/protocols/db/load-account-by-email-repo'
import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'

export class DbAuhentication implements Authentication {
  private readonly loadAccountByEmailRepo: LoadAccountByEmailRepo

  constructor (loadAccountByEmailRepo: LoadAccountByEmailRepo) {
    this.loadAccountByEmailRepo = loadAccountByEmailRepo
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email } = authentication
    await this.loadAccountByEmailRepo.load(email)
    return null as any
  }
}
