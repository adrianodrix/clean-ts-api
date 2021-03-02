import express from 'express'
import setupMiddlewares from './middlewares'
import securityPolicy from './security-policy'
import setupRoutes from './routes'
import setupSwagger from './swagger'

const app = express()

setupSwagger(app)
securityPolicy(app)
setupMiddlewares(app)
setupRoutes(app)

export default app
