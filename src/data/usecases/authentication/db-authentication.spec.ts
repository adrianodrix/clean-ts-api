import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/account/load-account-by-email-repo'
import { AuthenticationModel } from '@/domain/usecases/authentication'
import { UpdateAccessTokenRepo } from '@/data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../add-account/db-add-account-protocols'
import { DbAuhentication } from './db-authentication'

class LoadAccountByEmailRepoStub implements LoadAccountByEmailRepo {
  async loadByEmail (email: string): Promise<AccountModel> {
    return new Promise(resolve => resolve(makeFakeAccount()))
  }
}

class HashComparerStub implements HashComparer {
  async comparer (value: string, hash: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}

class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  }
}

class UpdateAccessTokenRepoStub implements UpdateAccessTokenRepo {
  async updateAccessToken (id: string, accessToken: string): Promise<void> {

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

const makeEncrypter = (): Encrypter => {
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepo = (): UpdateAccessTokenRepo => {
  return new UpdateAccessTokenRepoStub()
}

interface SutTypes {
  sut: DbAuhentication
  loadAccountByEmailRepoStub: LoadAccountByEmailRepo
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepoStub: UpdateAccessTokenRepo
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepoStub = makeLoadAccountByEmailRepo()
  const hashComparerStub = makeHashComparer()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepoStub = makeUpdateAccessTokenRepo()
  const sut = new DbAuhentication(
    loadAccountByEmailRepoStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepoStub
  )

  return {
    sut,
    loadAccountByEmailRepoStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepoStub
  }
}
describe('DBAuthentication UseCase', () => {
  test('should call LoadAccountByEmailRepo with correct email', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail')
    await sut.auth(makeFakeAuth())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if LoadAccountByEmailRepo throws', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepo returns null', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail').mockReturnValueOnce(null as any)
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

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const comparerSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(makeFakeAuth())
    expect(comparerSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    await expect(promise).rejects.toThrow()
  })

  test('should return token if Encrypter success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuth())
    expect(accessToken).toBe('any_token')
  })

  test('should call UpdateAccessTokenRepo with correct values', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken')
    await sut.auth(makeFakeAuth())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should throw if UpdateAccessTokenRepo throws', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSut()
    jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.auth(makeFakeAuth())
    await expect(promise).rejects.toThrow()
  })
})
