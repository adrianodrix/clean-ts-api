import { LoadSurveyResultRepo } from '@/data/protocols/db/survey-result/load-survey-result-repo'
import { mockLoadSurveyResultRepoStub } from '@/data/test'
import { DbLoadSurveyResult } from './db-load-survey-result'

type SutTypes = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepoStub: LoadSurveyResultRepo
}

const makeSut = (): SutTypes => {
  const loadSurveyResultRepoStub = mockLoadSurveyResultRepoStub()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepoStub)

  return {
    sut,
    loadSurveyResultRepoStub
  }
}

describe('DbLoadSurveyResult Usecase', () => {
  test('should call LoadSurveyResultRepo with correct values',async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
    await sut.load('any_survey_id')
    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  })
})
