import { LoadSurveyResultRepo } from '@/data/protocols/db/survey-result/load-survey-result-repo'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repo'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResult , SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepo: LoadSurveyResultRepo
  ) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    await this.saveSurveyRepository.save(data)
    return await this.loadSurveyResultRepo.loadBySurveyId(data.surveyId)
  }
}
