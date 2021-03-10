import MockDate from 'mockdate'
import { LoadSurveysRepo } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'
import { mockError, mockSurveys } from '@/domain/test'

class LoadSurveysRepoStub implements LoadSurveysRepo {
  async loadAll (): Promise<SurveyModel[]> {
    return Promise.resolve(mockSurveys())
  }
}

type SutTypes = {
  sut: DbLoadSurveys
  loadSurveysRepoStub: LoadSurveysRepo
}

const makeSut = (): SutTypes => {
  const loadSurveysRepoStub = new LoadSurveysRepoStub()
  const sut = new DbLoadSurveys(loadSurveysRepoStub)
  return {
    sut,
    loadSurveysRepoStub
  }
}
describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveysRepo', async () => {
    const { sut, loadSurveysRepoStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepoStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })

  test('should return a list if LoadSurveysRepo returns success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(mockSurveys())
  })

  test('should throw if LoadSurveysRepo throws', async () => {
    const { sut, loadSurveysRepoStub } = makeSut()
    jest.spyOn(loadSurveysRepoStub, 'loadAll').mockImplementationOnce(mockError)
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
