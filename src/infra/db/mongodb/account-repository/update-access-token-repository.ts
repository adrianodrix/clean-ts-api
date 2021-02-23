export interface UpdateAccessTokenRepo {
  update: (id: string, accessToken: string) => Promise<void>
}
