import { NEChunkUploader } from '../../src/index.js'

const uploader = new NEChunkUploader({
  uploadChunkURL: 'http://localhost',
  file: new Blob(Buffer.from('test string of file'))
})

console.log(uploader)
console.log(uploader.getDriver())
