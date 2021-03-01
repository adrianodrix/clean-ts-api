import { MongoClient, Collection } from 'mongodb'

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
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri)
    }
    return this.client.db().collection(name)
  },

  map: (data: any): any => {
    if (!data?._id) return data

    const { _id, ...rest } = data
    return { ...rest, id: _id }
  },

  mapCollection: (collection: any[]): any[] => {
    /* istanbul ignore next */
    return collection.map(c => MongoHelper.map(c))
  }
}
