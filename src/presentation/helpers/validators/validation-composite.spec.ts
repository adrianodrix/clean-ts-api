import { MissingParamError } from '@/presentation/errors'
import { Validation } from './validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return new MissingParamError('field')
  }
}

const makeSut = (): ValidationComposite => {
  const validationStub = new ValidationStub()
  return new ValidationComposite([validationStub])
}

describe('Validation Composite', () => {
  test('should return an error if any validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_value' })
    expect(error).toEqual(new MissingParamError('field'))
  })
})
