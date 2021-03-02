import 'module-alias/register'
import { MongoHelper as mongodb } from '@/infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

mongodb.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default

    app.get('/routes', (req, res) => {
      let route = []
      const routes = []

      app._router.stack.forEach((middleware) => {
        if (middleware.route) { // routes registered directly on the app
          routes.push(middleware.route)
        } else if (middleware.name === 'router') { // router middleware
          middleware.handle.stack.forEach((handler) => {
            route = handler.route
            route && routes.push(route)
          })
        }
      })
      return res.json(routes)
    })

    app.listen(env.port, () => console.log(`Server running at .. http://localhost:${env.port}`))
  })
  .catch(console.error)
