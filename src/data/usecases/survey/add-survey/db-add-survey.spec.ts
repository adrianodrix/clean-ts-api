import MockDate from 'mockdate'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurveyParams } from '@/domain/usecases/survey/add-survey'
import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey'
import { mockError } from '@/domain/test'

class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add (surveyData: AddSurveyParams): Promise<void> {}
}

type SutTypes = {
  sut: DbAddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
  const sut = new DbAddSurvey(addSurveyRepositoryStub)
  return {
    sut,
    addSurveyRepositoryStub
  }
}

const makeFakeData = (): AddSurveyParams => ({
  question: 'any_question',
  date: new Date(),
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})

describe('DBAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    const addSurveyRepositorySpy = jest.spyOn(addSurveyRepositoryStub, 'add')
    await sut.add(makeFakeData())
    expect(addSurveyRepositorySpy).toHaveBeenCalledWith(makeFakeData())
  })

  test('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    jest.spyOn(addSurveyRepositoryStub, 'add').mockImplementationOnce(mockError)
    const promise = sut.add(makeFakeData())
    await expect(promise).rejects.toThrow()
  })
})
