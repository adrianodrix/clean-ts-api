import { CompareFieldsValidation } from '@/validation/validators/compare-fields-validation'
import { EmailValidation } from '@/validation/validators/email-validation'
import { RequiredFieldValidation } from '@/validation/validators/required-fields-validation'
import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import { EmailValidator } from '@/validation/protocols/email-validator'
import { makeSignUpValidation } from '@/main/factories/controllers/auth/signup/signup-validation-factory'

jest.mock('@/validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('should call VaidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
