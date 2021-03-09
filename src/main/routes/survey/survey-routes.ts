import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-routes-adapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeLoadSurveyController } from '@/main/factories/controllers/survey/load-survey/load-surveys-controller-factory'
import { auth } from '@/main/middlewares/auth'

export default (router: Router): void => {
  // router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController())) // only admins
  router.post('/surveys', auth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
