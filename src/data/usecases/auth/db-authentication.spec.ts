import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { LoadAccountByEmailRepo } from '@/data/protocols/db/account/load-account-by-email-repo'
import { UpdateAccessTokenRepo } from '@/data/protocols/db/account/update-access-token-repository'
import { DbAuhentication } from '@/data/usecases/auth/db-authentication'
import { mockAuth, mockError } from '@/domain/test'
import { mockEncrypter, mockHashComparer, mockLoadAccountByEmailRepo, mockUpdateAccessTokenRepo } from '@/data/test'

type SutTypes = {
  sut: DbAuhentication
  loadAccountByEmailRepoStub: LoadAccountByEmailRepo
  hashComparerStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepoStub: UpdateAccessTokenRepo
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepoStub = mockLoadAccountByEmailRepo()
  const hashComparerStub = mockHashComparer()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepoStub = mockUpdateAccessTokenRepo()
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
    await sut.auth(mockAuth())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should throw if LoadAccountByEmailRepo throws', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail')
      .mockImplementationOnce(mockError)
    const promise = sut.auth(mockAuth())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if LoadAccountByEmailRepo returns null', async () => {
    const { sut, loadAccountByEmailRepoStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepoStub, 'loadByEmail').mockReturnValueOnce(null as any)
    const accessToken = await sut.auth(mockAuth())
    expect(accessToken).toBeFalsy()
  })

  test('should call HashComparer with correct password', async () => {
    const { sut, hashComparerStub } = makeSut()
    const comparerSpy = jest.spyOn(hashComparerStub, 'comparer')
    await sut.auth(mockAuth())
    expect(comparerSpy).toHaveBeenCalledWith('any_password', 'any_password')
  })

  test('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer')
      .mockImplementationOnce(mockError)
    const promise = sut.auth(mockAuth())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if hashComparer returns null', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'comparer').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(mockAuth())
    expect(accessToken).toBeFalsy()
  })

  test('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const comparerSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.auth(mockAuth())
    expect(comparerSpy).toHaveBeenCalledWith('any_id')
  })

  test('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockImplementationOnce(mockError)
    const promise = sut.auth(mockAuth())
    await expect(promise).rejects.toThrow()
  })

  test('should return null if Encrypter returns null', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.resolve(null))
    const accessToken = await sut.auth(mockAuth())
    expect(accessToken).toBeFalsy()
  })

  test('should return token if Encrypter success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(mockAuth())
    expect(accessToken).toBe('any_token')
  })

  test('should call UpdateAccessTokenRepo with correct values', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken')
    await sut.auth(mockAuth())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should throw if UpdateAccessTokenRepo throws', async () => {
    const { sut, updateAccessTokenRepoStub } = makeSut()
    jest.spyOn(updateAccessTokenRepoStub, 'updateAccessToken')
      .mockImplementationOnce(mockError)
    const promise = sut.auth(mockAuth())
    await expect(promise).rejects.toThrow()
  })
})
