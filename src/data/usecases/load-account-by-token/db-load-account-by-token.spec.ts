import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string> {
    return 'any_value'
  }
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const makeSut = (): SutTypes => {
  const decrypterStub = new DecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)
  return {
    sut,
    decrypterStub
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
})
