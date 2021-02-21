import { LogErrorRepository } from '@/data/protocols/log-error-repository'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller
  private readonly logErrorRepo: LogErrorRepository

  constructor (controller: Controller, logErrorRepo: LogErrorRepository) {
    this.controller = controller
    this.logErrorRepo = logErrorRepo
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepo.log(httpResponse.body?.stack)
    }
    return httpResponse
  }
}
