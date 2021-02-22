import { InvalidParamError } from '@/presentation/errors'
import { EmailValidator } from '@/presentation/protocols/email-validator'
import { Validation } from './validation'

export class EmailValidation implements Validation {
  private readonly fieldName: string
  private readonly emailValidator: EmailValidator

  constructor (fieldName: string, emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
    this.fieldName = fieldName
  }

  validate (input: any): Error {
    if (!this.emailValidator.isValid(input[this.fieldName])) {
      return new InvalidParamError(this.fieldName)
    }
    return null as any
  }
}
