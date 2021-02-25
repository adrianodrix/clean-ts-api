import 'module-alias/register'
import { MongoHelper as mongodb } from '@/infra/db/mongodb/helpers/mongo-helper'
import env from './config/env'

console.log(env.mongoUrl)
mongodb.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default
    app.listen(env.port, () => console.log(`Server running at .. http://localhost:${env.port}`))
  })
  .catch(console.error)
