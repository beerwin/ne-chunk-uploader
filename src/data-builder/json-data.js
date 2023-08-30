import BaseDataBuilder from './base-data'

export default class JsonDataBuilder extends BaseDataBuilder {
  build () {
    return JSON.stringify(this.data)
  }
}
