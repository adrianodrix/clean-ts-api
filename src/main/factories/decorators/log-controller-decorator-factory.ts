import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'
import { LogMongoRepository } from '@/infra/db/mongodb/log/log-mongo-repository'
import { Controller } from '@/presentation/protocols'
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export const makeLogControllerDecorator = (controller: Controller): LogControllerDecorator => {
  const logMongoRepository: LogErrorRepository = new LogMongoRepository()
  return new LogControllerDecorator(controller, logMongoRepository)
}
