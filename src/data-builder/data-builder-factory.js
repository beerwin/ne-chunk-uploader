import FormDataBuilder from './form-data.js'
import JsonDataBuilder from './json-data.js'

export default function getDataBuilder (data, contentType) {
  switch (contentType) {
    case 'application/json':
      return new JsonDataBuilder(data)
    case 'multipart/form-data':
    default:
      return new FormDataBuilder(data)
  }
}
