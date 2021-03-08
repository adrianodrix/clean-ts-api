import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyById {
  loadById: (id: String) => Promise<SurveyModel>
}
