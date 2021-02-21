import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'
import { LogControllerDecorator } from './log'

class ControllerStub implements Controller {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse: HttpResponse = {
      statusCode: 200,
      body: {
        name: 'any_name@mail.com',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    return new Promise(resolve => resolve(httpResponse))
  }
}

describe('Log Decorator', () => {
  test('should call controller handle ', async () => {
    const controllerStub = new ControllerStub()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const sut = new LogControllerDecorator(controllerStub)
    const httpRequest: HttpRequest = {
      body: {
        name: 'any_name@mail.com',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })
})
