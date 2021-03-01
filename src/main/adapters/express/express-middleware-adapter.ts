import { NextFunction, Request, Response } from 'express'
import { Middleware } from '@/presentation/protocols/middleware'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { headers } = req
    const httpRequest: HttpRequest = {
      headers
    }
    const httpResponse: HttpResponse = await middleware.handle(httpRequest)
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      next()
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body.message
      })
    }
  }
}
