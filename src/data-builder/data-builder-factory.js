import FormDataBuilder from './form-data'
import JsonDataBuilder from './json-data'

export default function getDataBuilder (data, contentType) {
  switch (contentType) {
    case 'application/json':
      return new JsonDataBuilder(data)
    case 'multipart/form-data':
    default:
      return new FormDataBuilder(data)
  }
}
