import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repo'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult , SaveSurveyResultModel } from '@/domain/usecases/survey-result/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (private readonly saveSurveyRepository: SaveSurveyResultRepository) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return await this.saveSurveyRepository.save(data)
  }
}