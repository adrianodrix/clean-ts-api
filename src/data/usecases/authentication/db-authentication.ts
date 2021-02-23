import { LoadAccountByEmailRepo } from '../../protocols/load-account-by-email-repo'
import { Authentication, AuthenticationModel } from '@/domain/usecases/authentication'

export class DbAuhentication implements Authentication {
  private readonly loadAccountByEmailRepo: LoadAccountByEmailRepo

  constructor (loadAccountByEmailRepo: LoadAccountByEmailRepo) {
    this.loadAccountByEmailRepo = loadAccountByEmailRepo
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    const { email, password } = authentication
    await this.loadAccountByEmailRepo.load(email)
    return null as any
  }
}
