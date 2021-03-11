import { LoadSurveyResultRepo } from '@/data/protocols/db/survey-result/load-survey-result-repo'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepo: LoadSurveyResultRepo) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    return await this.loadSurveyResultRepo.loadBySurveyId(surveyId)
  }
}
