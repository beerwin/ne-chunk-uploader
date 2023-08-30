import Chunk from './chunk'
import defaultOptions from './config/default-options'
import { INVALID_UPLOAD_URL, NO_FILE_SELECTED } from './config/errors'
import HasEvents from './common/has-events'
import { NoRetryStrategy } from './retry/retries'
import FetchDriver from './transfer-drivers/fetch-driver'
import { v4 } from 'uuid'

export default class NEChunkUploader extends HasEvents {
  constructor (options) {
    super()
    this.options = { ...defaultOptions, ...options }
    if (!this.options.retryStrategy) {
      this.options.retryStrategy = new NoRetryStrategy()
    }
    this.aborted = false
    this.chunksUploaded = 0

    if (!this.options.uploadChunkURL) {
      throw new Error(INVALID_UPLOAD_URL)
    }

    if (!this.options.file) {
      throw new Error(NO_FILE_SELECTED)
    }

    // getDriver should be used to configure it further
    if (!this.options.driver) {
      this.options.driver = new FetchDriver()
    }
  }

  async upload () {
    this._setupChunks()
    for (let x = 0; x < this.chunkCount; x++) {
      if (this.aborted) {
        this._aborted()
        return
      }
      await this._createChunk(x)
    }
    this._complete()
  }

  getDriver () {
    return this.options.driver
  }

  abort () {
    this.aborted = true
  }

  async _createChunk (index) {
    const chunkStart = index * this.options.chunkSize
    const chunkEnd = Math.min(chunkStart + this.options.chunkSize, this.options.file.size)
    const chunk = new Chunk({
      start: chunkStart,
      size: chunkEnd - chunkStart,
      totalSize: this.options.file.size,
      body: this.options.file.slice(chunkStart, chunkEnd),
      id: this._id(),
      index,
      uploadURL: this.options.uploadChunkURL,
      driver: this.options.driver,
      retryStrategy: this.options.retryStrategy,
      additionalHeaders: this.options.additionalHeaders,
      additionalFields: this.options.additionalFields,
      contentType: this.options.contentType
    })
    chunk.addEventListener('error', this._chunkError.bind(this))
    chunk.addEventListener('ready', this._chunkComplete.bind(this))
    chunk.addEventListener('retry', this._chunkRetry.bind(this))
    await chunk.upload()
  }

  _setupChunks () {
    this.chunksUploading = []
    this.chunkCount = Math.ceil(this.options.file.size / this.options.chunkSize)
    this.trigger('progress', {
      totalChunks: this.chunkCount,
      chunkSize: this.options.chunkSize,
      chunksUploaded: 0,
      chunksUploading: 0,
      percentage: 0
    })
  }

  _id () {
    return 'upload_id_' + v4()
  }

  _aborted () {
    this.trigger('abort', this.options)
  }

  _chunkError (data) {
    this._abort()
    this.trigger('error', {
      type: 'chunkError',
      error: data
    })
  }

  _chunkRetry (data) {
    this.trigger('chunkRetry', {
      totalChunks: this.chunkCount,
      chunkSize: data.chunkSize,
      chunksUploaded: this.chunksUploaded,
      percentage: (this.chunksUploaded / this.chunkCount) * 100
    })
  }

  _chunkComplete (data) {
    ++this.chunksUploaded
    this.trigger('progress', {
      totalChunks: this.chunkCount,
      chunkSize: data.chunkSize,
      chunksUploaded: this.chunksUploaded,
      percentage: (this.chunksUploaded / this.chunkCount) * 100
    })
  }

  _complete () {
    this.trigger('complete', {
      totalChunks: this.chunkCount,
      chunkSize: this.options.chunkSize,
      chunksUploaded: this.chunksUploaded,
      percentage: 100
    })
  }

  _abort () {
    this.aborted = true
  }
}
