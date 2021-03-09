import { SurveyResultModel } from '@/domain/models/survey-result'

export type SaveSurveyResultModel = Omit<SurveyResultModel, 'id'>

export interface AddSurveyResult {
  save: (data: SaveSurveyResultModel) => Promise<SaveSurveyResultModel>
}
