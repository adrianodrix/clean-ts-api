import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/load-account-by-email-repo'
import { AuthenticationModel } from '@/domain/usecases/authentication'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuhentication } from './db-authentication'

class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepo {
  async load (email: string): Promise<AccountModel> {
    return new Promise(resolve => resolve(makeFakeAccount()))
  }
}

class HashComparerStub implements HashComparer {
  async comparer (value: string, hash: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}

class TokenGeneratorStub implements TokenGenerator {
  async generate (value: string): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const makeFakeAuth = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadAccountByEmailRepo = (): LoadAccountByEmailRepo => {
  return new LoadAccountByEmailRepoStub()
}

const makeHashComparer = (): HashComparer => {
  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  return new TokenGeneratorStub()
}

interface SutTypes {
  sut: DbAuhentication
  loadAccountByEmailRepoStub: LoadAccountByEmailRepo
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepo()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const sut = new DbAuhentication(loadAccountByEmailRepoStub, hashComparerStub, tokenGeneratorStub)

  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub,
    tokenGeneratorStub
  }
}
describe('DBAuthentication UseCase', () => {
  test('should call LoadAccountByEmailRepo with correct email', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepoStub, 'load')
    await sut.auth(makeFakeAuth())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if LoadAccountByEmailRepo throws', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepo returns null', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, 'load').mockReturnValueOnce(null as any)
    const accessToken = await sut.auth(makeFakeAuth())
    expect(accessToken).toBeFalsy()
  })

  test('should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'comparer')
    await sut.auth(makeFakeAuth())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if hashComparer returns null', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockReturnValueOnce(new Promise(resolve => resolve(false)))
    const accessToken = await sut.auth(makeFakeAuth())
    expect(accessToken).toBeFalsy()
  })

  test('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const comparerSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuth())
    expect(comparerSpy).toHaveBeenCalledWith('any_id')
  })
})
