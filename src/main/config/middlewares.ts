import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { corsMiddleware } from '../middlewares/cors'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(corsMiddleware)
}
