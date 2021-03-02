import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '@/main/factories/use-cases/survey/db-load-surveys-factory'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-survey/load-surveys-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys())
  return makeLogControllerDecorator(controller)
}
