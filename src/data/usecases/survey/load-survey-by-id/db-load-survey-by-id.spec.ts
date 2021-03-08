import { LoadSurveyByIdRepo } from '@/data/protocols/db/survey/load-surveys-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import MockDate from 'mockdate'
import { DbLoadSurveyById } from './db-load-survey-by-id'

class LoadSurveyByIdRepoStub implements LoadSurveyByIdRepo {
  async loadById (id: String): Promise<SurveyModel> {
    return new Promise(resolve => resolve(makeFakeSurvey()))
  }
}

const makeFakeSurvey = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    date: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'any_ansser'
      }
    ]
  }
}

type SutTypes = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepoStub: LoadSurveyByIdRepo
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepoStub = new LoadSurveyByIdRepoStub()
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
    expect(surveys).toEqual(makeFakeSurvey())
  })

  test('should throw if LoadSurveyByIdRepo throws', async () => {
    const { sut, loadSurveyByIdRepoStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepoStub, 'loadById').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.loadById('any_id')
    await expect(promise).rejects.toThrow()
  })
})
