import bcrypt from 'bcrypt'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { mockError } from '@/domain/test'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
  async compare (value: string, hash: string): Promise<boolean> {
    return new Promise(resolve => resolve(true))
  }
}))

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('should call hash with correct value', async () => {
      const sut = makeSut()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await sut.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('should return a valid hash on hash success', async () => {
      const sut = makeSut()
      const hash = await sut.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('should throw if hash throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(mockError)

      const promise = sut.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('comparer()', () => {
    test('should call comparer with correct value', async () => {
      const sut = makeSut()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await sut.comparer('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('should return true where compare suceeds', async () => {
      const sut = makeSut()
      const isValid = await sut.comparer('any_value', 'any_hash')
      expect(isValid).toBeTruthy()
    })

    test('should return false where compare fails', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)))
      const isValid = await sut.comparer('any_value', 'any_hash')
      expect(isValid).toBeFalsy()
    })

    test('should throw if compare throws', async () => {
      const sut = makeSut()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(mockError)

      const promise = sut.comparer('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
