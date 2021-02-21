import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { corsMiddleware } from '../middlewares/cors'
import { content } from '../middlewares/content-type'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(corsMiddleware)
  app.use(content)
}
