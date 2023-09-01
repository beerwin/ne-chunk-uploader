import { NEChunkUploader } from '../../src/index.js' // this to work with the current source code
// import { NEChunkUploader } from 'ne-chunk-uploader'

const uploader = new NEChunkUploader({
  uploadChunkURL: 'http://localhost',
  file: new Blob(Buffer.from('test string of file'))
})

console.log(uploader)
console.log(uploader.getDriver())
