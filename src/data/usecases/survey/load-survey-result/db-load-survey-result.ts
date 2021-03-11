import { LoadSurveyResultRepo } from '@/data/protocols/db/survey-result/load-survey-result-repo'
import { LoadSurveyByIdRepo } from '@/data/protocols/db/survey/load-surveys-by-id-repository'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepo: LoadSurveyResultRepo,
    private readonly loadSurveyByIdRepo: LoadSurveyByIdRepo
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepo.loadBySurveyId(surveyId)
    if (surveyResult) return surveyResult

    const { question, date, answers } = await this.loadSurveyByIdRepo.loadById(surveyId)
    surveyResult = {
      surveyId,
      question,
      date,
      answers: answers.map(answer => Object.assign({}, answer, {
        count: 0,
        percent: 0.0
      }))
    }
    return surveyResult
  }
}
