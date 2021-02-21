import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null,
  uri: null,
  async connect (uri: string | undefined): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  }
}
