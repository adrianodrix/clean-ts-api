import MockDate from 'mockdate'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repo'
import { DbSaveSurveyResult } from './db-save-survey-result'
import { mockError, mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/test'
import { mockLoadSurveyResultRepoStub, mockSaveSurveyResultRepository } from '@/data/test'
import { LoadSurveyResultRepo } from '@/data/protocols/db/survey-result/load-survey-result-repo'

type SutTypes = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
  loadSurveyResultRepoStub: LoadSurveyResultRepo
}

const makeSut = (): SutTypes => {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepoStub = mockLoadSurveyResultRepoStub()
  const sut = new DbSaveSurveyResult(saveSurveyResultRepositoryStub, loadSurveyResultRepoStub)
  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepoStub
  }
}

describe('DBSaveSurveyResult UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')
    await sut.save(mockSaveSurveyResultParams())
    expect(saveSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams())
  })

  test('should throw if SaveSurveyResultRepositoryStub throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockImplementationOnce(mockError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('should call LoadSurveyResultRepo with correct values', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId')
    await sut.save(mockSaveSurveyResultParams())
    expect(loadSpy).toHaveBeenCalledWith(mockSaveSurveyResultParams().surveyId)
  })

  test('should throw if LoadSurveyResultRepo throws', async () => {
    const { sut, loadSurveyResultRepoStub } = makeSut()
    jest.spyOn(loadSurveyResultRepoStub, 'loadBySurveyId').mockImplementationOnce(mockError)
    const promise = sut.save(mockSaveSurveyResultParams())
    await expect(promise).rejects.toThrow()
  })

  test('should return a survey if SaveSurveyResultRepository returns success', async () => {
    const { sut } = makeSut()
    const survey = await sut.save(mockSaveSurveyResultParams())
    expect(survey).toEqual(mockSurveyResultModel())
  })
})
