export class InvalidParamError extends Error {
  constructor (paranName: string) {
    super(`Invalid param: ${paranName}`)
    this.name = 'InvalidParamError'
  }
}
