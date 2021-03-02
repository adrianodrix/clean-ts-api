import MockDate from 'mockdate'
import { LoadSurveysRepo } from '@/data/protocols/db/survey/load-surveys-repository'
import { SurveyModel } from '@/domain/models/survey'
import { DbLoadSurveys } from './db-load-surveys'

class LoadSurveysRepoStub implements LoadSurveysRepo {
  async loadAll (): Promise<SurveyModel[]> {
    return new Promise(resolve => resolve(makeFakeSurveys()))
  }
}

const makeFakeSurveys = (): SurveyModel[] => {
  return [
    {
      id: 'any_id',
      question: 'any_question',
      date: new Date(),
      answers: [
        {
          image: 'any_image',
          answer: 'any_ansser'
        }
      ]
    },
    {
      id: 'other_id',
      question: 'other_question',
      date: new Date(),
      answers: [
        {
          image: 'other_image',
          answer: 'other_ansser'
        },
        {
          answer: 'one_more_ansser'
        }
      ]
    }
  ]
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
    expect(surveys).toEqual(makeFakeSurveys())
  })

  test('should throw if LoadSurveysRepo throws', async () => {
    const { sut, loadSurveysRepoStub } = makeSut()
    jest.spyOn(loadSurveysRepoStub, 'loadAll').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const promise = sut.load()
    await expect(promise).rejects.toThrow()
  })
})
