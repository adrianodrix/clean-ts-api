import MockDate from 'mockdate'
import { LoadSurveyByIdRepo } from '@/data/protocols/db/survey/load-surveys-by-id-repository'
import { DbLoadSurveyById } from './db-load-survey-by-id'
import { mockError, mockSurveyModel } from '@/domain/test'
import { mockLoadSurveyByIdRepo } from '@/data/test'

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepoStub: LoadSurveyByIdRepo
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepoStub = mockLoadSurveyByIdRepo()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepoStub)
  return {
    sut,
    loadSurveyByIdRepoStub
  }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveyByIdRepo', async () => {
    const { sut, loadSurveyByIdRepoStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadSurveyByIdRepoStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return a survey if LoadSurveyByIdRepo returns success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.loadById('any_id')
    expect(surveys).toEqual(mockSurveyModel())
  })

  test('should throw if LoadSurveyByIdRepo throws', async () => {
    const { sut, loadSurveyByIdRepoStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepoStub, 'loadById').mockImplementationOnce(mockError)
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
