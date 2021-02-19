export class MissingParamError extends Error {
  constructor (paranName: string) {
    super(`Missing param: ${paranName}`)
    this.name = 'MissingParamError'
  }
}
