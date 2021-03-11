import { LoadSurveyResultRepo } from '@/data/protocols/db/survey-result/load-survey-result-repo'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/test'
import { DbLoadSurveyResult } from './db-load-survey-result'

describe('DbLoadSurveyResult Usecase', () => {
  test('should call LoadSurveyResultRepo with correct values',async () => {
    class LoadSurveyResultRepoStub implements LoadSurveyResultRepo {
      async loadBySurveyId (surveyId: string): Promise<SurveyResultModel> {
        return Promise.resolve(mockSurveyResultModel())
      }
    }
    const loadSurveyResultRepoStub = new LoadSurveyResultRepoStub()
    const sut = new DbLoadSurveyResult(loadSurveyResultRepoStub)
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
