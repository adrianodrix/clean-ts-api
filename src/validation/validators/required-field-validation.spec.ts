import { MissingParamError } from '@/presentation/errors'
import { RequiredFieldValidation } from './required-fields-validation'

const makeSut = (): RequiredFieldValidation => (new RequiredFieldValidation('any_field'))

describe('RequiredField Validation', () => {
  test('should return a MissinParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
