const defaultOptions = {
  uploadChunkURL: '',
  fileName: '',
  fileType: 'application/octet-stream',
  additionalFields: {},
  additionalHeaders: {},
  contentType: 'multipart/form-data',
  file: null,
  chunkSize: 5 * 1024 * 1024,
  retryStrategy: undefined,
  driver: null
}

export default defaultOptions
