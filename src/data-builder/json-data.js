import BaseDataBuilder from './base-data.js'

export default class JsonDataBuilder extends BaseDataBuilder {
  build () {
    return JSON.stringify(this.data)
  }
}
