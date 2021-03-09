import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepo } from '@/data/protocols/db/account/load-account-by-token-repo'
import { AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'
import { mockAccountModel, mockError } from '@/domain/test'

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string> {
    return 'any_value'
  }
}

class LoadAccountByTokenRepoStub implements LoadAccountByTokenRepo {
  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    return mockAccountModel()
  }
}

type SutTypes = {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepoStub: LoadAccountByTokenRepo
}

const makeSut = (): SutTypes => {
  const decrypterStub = new DecrypterStub()
  const loadAccountByTokenRepoStub = new LoadAccountByTokenRepoStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepoStub)
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepoStub
  }
}

describe('DbLoadAccountByToken', () => {
  test('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(mockError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('should call LoadAccountByTokenRepo with correct values', async () => {
    const { sut, loadAccountByTokenRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepoStub, 'loadByToken')
    await sut.load('any_token', 'any_role')
    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('should return null if LoadAccountByTokenRepo returns null', async () => {
    const { sut, loadAccountByTokenRepoStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepoStub, 'loadByToken').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const account = await sut.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('should throw if LoadAccountByTokenRepo throws', async () => {
    const { sut, loadAccountByTokenRepoStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepoStub, 'loadByToken').mockImplementationOnce(mockError)
    const promise = sut.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('should return an account if LoadAccountByTokenRepo returns success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })
})
