import { SurveyResultModel } from '@/domain/models/survey-result'

export interface LoadSurveyResultRepo {
  loadBySurveyId: (surveyId: string) => Promise<SurveyResultModel>
}
