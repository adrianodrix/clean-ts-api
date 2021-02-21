import express from 'express'
import setupMiddlewares from './middlewares'
import securityPolicy from './security-policy'

const app = express()

securityPolicy(app)
setupMiddlewares(app)

export default app
