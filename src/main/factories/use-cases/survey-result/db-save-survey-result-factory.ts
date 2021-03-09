import { DbSaveSurveyResult } from '@/data/usecases/survey/save-survey-result/db-save-survey-result'
import { SurveyResultMongoRepository } from '@/infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): DbSaveSurveyResult => {
  const saveReulstMongoRepository = new SurveyResultMongoRepository()
  return new DbSaveSurveyResult(saveReulstMongoRepository)
}
