import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

class DecrypterStub implements Decrypter {
  async decrypt (value: string): Promise<string> {
    return 'any_value'
  }
}

const makeSut = (): any => {
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
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
