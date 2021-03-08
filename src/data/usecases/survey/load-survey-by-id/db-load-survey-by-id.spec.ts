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
})
