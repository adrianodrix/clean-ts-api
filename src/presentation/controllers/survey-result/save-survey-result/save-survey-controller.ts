import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { serverError } from '@/main/docs/components'
import { ok } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class SaveSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)

      return ok(survey)
    } catch (error) {
      return serverError(error)
    }
  }
}
