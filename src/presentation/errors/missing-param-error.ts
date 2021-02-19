export class MissingParamError extends Error {
  constructor (paranName: string) {
    super(`Missing param: ${paranName}`)
    this.name = 'MissingParamError'
  }
}

export class InvalidParamError extends Error {
  constructor (paranName: string) {
    super(`Invalid param: ${paranName}`)
    this.name = 'InvalidParamError'
  }
}
