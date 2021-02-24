export interface UpdateAccessTokenRepo {
  updateAccessToken: (id: string, accessToken: string) => Promise<void>
}
