import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-routes-adapter'
import { makeAddSurveyController } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'
import { adaptMiddleware } from '@/main/adapters/express/express-middleware-adapter'
import { makeLoadSurveyController } from '@/main/factories/controllers/survey/load-survey/load-surveys-controller-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  const auth = adaptMiddleware(makeAuthMiddleware())

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveyController()))
}
