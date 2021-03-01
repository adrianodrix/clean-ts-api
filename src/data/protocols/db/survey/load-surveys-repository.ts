import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveysRepo {
  loadAll: () => Promise<SurveyModel[]>
}
