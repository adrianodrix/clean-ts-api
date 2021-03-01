import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-routes-adapter'
import { makeSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeSurveyController()))
}
