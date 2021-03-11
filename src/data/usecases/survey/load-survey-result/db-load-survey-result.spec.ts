import { LoadSurveyResultRepo } from '@/data/protocols/db/survey-result/load-survey-result-repo'
import { mockLoadSurveyResultRepoStub } from '@/data/test'
import { mockError, mockSurveyResultModel } from '@/domain/test'
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

  test('should throw if LoadSurveyResultRepo throws', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId').mockImplementationOnce(mockError)
    const promise = sut.load('any_survey_id')
    await expect(promise).rejects.toThrow()
  })

  test('should return a survey result if LoadSurveyResultRepo returns success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load('any_survey_id')
    expect(surveys).toEqual(mockSurveyResultModel())
  })
})
