import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'
import swaggerConfig from '@/main/docs'
import { noCache } from '../middlewares/no-cache'

const options = {
  customSiteTitle: '4Dev | Enquetes para Programadores | Docs API'
}

export default (app: Express): void => {
  app.use('/api/docs', noCache, serve, setup(swaggerConfig, options))
}
