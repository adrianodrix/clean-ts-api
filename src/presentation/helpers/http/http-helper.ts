import { ServerError } from '@/presentation/errors'
import { Unauthorized } from '@/presentation/errors/unauthorized-error'
import { HttpResponse } from '@/presentation/protocols/http'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new Unauthorized()
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const serverError = (error: Error): HttpResponse => {
  console.error(error)
  return {
    statusCode: 500,
    body: new ServerError(error?.stack)
  }
}

export const created = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})

export const noContent = (): HttpResponse => ({
  statusCode: 204,
  body: null
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
