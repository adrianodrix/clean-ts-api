import { Authentication, AuthenticationParams } from '@/domain/usecases/auth/authentication'

export const mockAuth = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationParams): Promise<string> {
      return 'any_token'
    }
  }

  return new AuthenticationStub()
}
