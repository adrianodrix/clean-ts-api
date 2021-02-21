import express from 'express'
import setupMiddlewares from './middlewares'
import securityPolicy from './security-policy'
import setupRoutes from './routes'

const app = express()

securityPolicy(app)
setupMiddlewares(app)
setupRoutes(app)

export default app
