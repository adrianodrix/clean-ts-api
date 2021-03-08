import { SaveSurveyResultRepository } from '@/data/protocols/db/survey/save-survey-result-repo'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultModel } from '@/domain/usecases/survey/save-survey-result'

export class DbSaveSurveyResult implements DbSaveSurveyResult {
  constructor (private readonly saveSurveyRepository: SaveSurveyResultRepository) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return await this.saveSurveyRepository.save(data)
  }
}
