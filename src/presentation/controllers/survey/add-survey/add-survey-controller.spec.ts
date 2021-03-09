import MockDate from 'mockdate'
import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { MissingParamError, ServerError } from '@/presentation/errors'
import { badRequest, noContent, serverError } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/protocols/validation'
import { HttpRequest } from '../../auth/signup/signup--controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { mockValidation } from '@/presentation/test'
import { mockAAddSurveyRepository } from '@/data/test'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    date: new Date(),
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }
})

type SutTypes = {
  sut: AddSurveyController
  validationStub: Validation
  addSurveyStub: AddSurvey
}

const makeSut = (): SutTypes => {
  const validationStub = mockValidation()
  const addSurveyStub = mockAAddSurveyRepository()
  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('AddSurvey Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()
    const addSpy = jest.spyOn(addSurveyStub, 'add')

    await sut.handle(makeFakeRequest())
    const { question, answers, date } = makeFakeRequest().body
    expect(addSpy).toHaveBeenCalledWith({ question, answers, date })
  })

  test('should return 204 if valid data is provided', async () => {
    // SUT - System Under Test
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(noContent())
  })

  test('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })
})
