import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { InvalidParamError, ServerError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoadSurveyResultController implements Controller {
  constructor (private readonly loadSurveyById: LoadSurveyById) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { surveyId } = httpRequest.params
      const survey = await this.loadSurveyById.loadById(surveyId)
      if (!survey) return forbidden(new InvalidParamError('surveyId'))
    } catch (error) {
      return serverError(new ServerError(error))
    }
  }
}
