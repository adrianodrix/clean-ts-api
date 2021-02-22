import { MissingParamError } from '@/presentation/errors'
import { Validation } from './validation'

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string
  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): Error {
    if (!input[this.fieldName]) {
      /* istanbul ignore next */
      return new MissingParamError(this.fieldName)
    }
    return null as any
  }
}
