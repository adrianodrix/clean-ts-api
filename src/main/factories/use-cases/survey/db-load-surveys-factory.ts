import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
import { DbLoadSurveys } from '@/data/usecases/survey/load-survey/db-load-surveys'
import { SurveyMongoRepository } from '@/infra/db/mongodb/survey/survey-mongo-repository'

export const makeDbLoadSurveys = (): DbLoadSurveys => {
  const loadSurveyRepository = new SurveyMongoRepository()
  return new DbLoadSurveys(loadSurveyRepository)
}
