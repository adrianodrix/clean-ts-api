import MockDate from 'mockdate'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { LoadSurveysController } from './load-surveys-controller'
import { ok, serverError } from '@/presentation/helpers/http/http-helper'
import { ServerError } from '@/presentation/errors'

class LoadSurveysStub implements LoadSurveys {
  async load (): Promise<SurveyModel[]> {
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

const makeSut = (): any => {
  const loadSurveysStub = new LoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('should return 200 status code and a list of surveys when call LoadSurveys', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeFakeSurveys()))
  })

  test('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle()
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })
})
