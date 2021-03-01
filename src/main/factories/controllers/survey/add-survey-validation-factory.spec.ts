import { RequiredFieldValidation } from '@/validation/validators/required-fields-validation'
import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite } from '@/validation/validators/validation-composite'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('should call VaidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
