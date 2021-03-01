export interface SurveyModel {
  id: string
  question: string
  date: Date
  answers: SurveyAnswerModel[]
}

export interface SurveyAnswerModel {
  image?: string
  answer: string
}
