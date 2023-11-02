import BaseDataBuilder from './base-data.js'

export default class FormDataBuilder extends BaseDataBuilder {
  build () {
    const fd = new FormData()
    for (const name in this.data) {
      console.log(this.data[name])
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!this.data[name].fileName) {
        fd.append(name, this.data[name].content, this.data[name].fileName)
      } else {
        fd.append(name, this.data[name])
      }
    }
    return fd
  }
}
