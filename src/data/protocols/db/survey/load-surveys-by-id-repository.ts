import { SurveyModel } from '@/domain/models/survey'

export interface LoadSurveyByIdRepo {
  loadById: (id: string) => Promise<SurveyModel>
}
