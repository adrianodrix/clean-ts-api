import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepo } from '@/data/protocols/db/account/load-account-by-token-repo'
import { LoadAccountByToken } from '@/domain/usecases/load-account-by-token'
import { AccountModel } from '../add-account/db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepo: LoadAccountByTokenRepo
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)
    if (!token) return null as any

    await this.loadAccountByTokenRepo.loadByToken(accessToken, role)
    return null as any
  }
}
