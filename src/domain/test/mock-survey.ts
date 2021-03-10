import { HttpRequest } from '@/presentation/protocols'
import { SurveyModel } from '../models/survey'
import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases/survey-result/save-survey-result'
import { AddSurveyParams } from '../usecases/survey/add-survey'

export const mockAddSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  date: new Date(),
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }, {
    answer: 'other_answer'
  }]
})

export const mockSurveyModel = (): SurveyModel => {
  return {
    id: 'any_id',
    question: 'any_question',
    date: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      }
    ]
  }
}

export const mockSaveSurveyResultParams = (): SaveSurveyResultParams => ({
  surveyId: 'any_surveyId',
  accountId: 'any_accountId',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_qyestion',
  date: new Date(),
  answers: [
    {
      image: 'any_image',
      answer: 'any_answer',
      count: 10,
      percent: 55.7,
      isCurrentAccountAnswer: false
    },
    {
      image: 'other_image',
      answer: 'other_answer',
      count: 0,
      percent: 0.0,
      isCurrentAccountAnswer: true
    }
  ]
})

export const mockSurveys = (): SurveyModel[] => {
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

export const mockSurveyResultRequest = (): HttpRequest => ({
  params: {
    surveyId: 'any_survey_id'
  },
  body: {
    answer: 'any_answer'
  },
  accountId: 'any_account_id'
})
