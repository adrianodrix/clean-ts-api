export type SurveyModel = {
  id: string
  question: string
  date: Date
  answers: SurveyAnswerModel[]
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
}
