import { LoadSurveysRepo } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'

export class DbLoadSurveys implements LoadSurveys {
  constructor (private readonly loadSurveysRepo: LoadSurveysRepo) {}

  async load (): Promise<SurveyModel[]> {
    const list = await this.loadSurveysRepo.loadAll()
    if (!list.length) return null

    return list
  }
}
