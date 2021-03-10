import { serve, setup } from 'swagger-ui-express'
import { Express } from 'express'
import swaggerConfig from '@/main/docs'
import { noCache } from '../middlewares/no-cache'

const options = {
  customSiteTitle: '4Dev | Enquetes para Programadores | Docs API',
  customfavIcon: 'https://web.whatsapp.com/img/favicon/1x/favicon.png',
  customCss: '.swagger-ui .topbar-wrapper img {content: url("https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/WhatsApp_horizontal.svg/497px-WhatsApp_horizontal.svg.png");}'
}

export default (app: Express): void => {
  app.use('/api/docs', noCache, serve, setup(swaggerConfig, options))
}
