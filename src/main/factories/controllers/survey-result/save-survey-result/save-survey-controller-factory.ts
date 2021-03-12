import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-controller'
import { Controller } from '@/presentation/protocols'
import { makeDbLoadSurveyById } from '@/main/factories/use-cases/load-survey-by-id/load-survey-by-id-factory'
import { makeDbSaveSurveyResult } from '@/main/factories/use-cases/survey-result/db-save-survey-result-factory'

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(makeDbLoadSurveyById(), makeDbSaveSurveyResult())
  return makeLogControllerDecorator(controller)
}
