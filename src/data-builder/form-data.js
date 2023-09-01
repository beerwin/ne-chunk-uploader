import BaseDataBuilder from './base-data.js'

export default class FormDataBuilder extends BaseDataBuilder {
  build () {
    const fd = new FormData()
    for (const name in this.data) {
      fd.append(name, this.data[name])
    }
  }
}
