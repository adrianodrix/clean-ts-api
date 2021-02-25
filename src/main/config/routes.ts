import { Express, Router } from 'express'
import fg from 'fast-glob'
import { resolve } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const fullPath = resolve(__dirname, '../..')
  fg.sync(`${fullPath}/main/routes/**/*routes.??`, { ignore: ['*.test*', '*.spec*'] })
    .map(async file => {
      (await import(file)).default(router)
    })
}
