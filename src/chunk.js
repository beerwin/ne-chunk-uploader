import getDataBuilder from './data-builder/data-builder-factory.js'
import HasEvents from './common/has-events.js'

export default class Chunk extends HasEvents {
  constructor (options) {
    super()

    if (typeof options.start === 'undefined' || options.start === null || isNaN(options.start) || options.start < 0) {
      throw new Error('CS0010: Invalid chunk start argument')
    }

    if (typeof options.size === 'undefined' || options.size === null || isNaN(options.size) || options.size < 1) {
      throw new Error('CS0011: Invalid chunk size argument')
    }

    if (!options.body) {
      throw new Error('CS0012: A chunk body must be specified (No data to upload).')
    }

    if (!options.id) {
      throw new Error('CS0013: The upload must have an ID. This helps identifying the chunks')
    }

    if (typeof options.index === 'undefined' || options.index === null || isNaN(options.index) || options.index < 0) {
      throw new Error('CS0014: The chunk index is invalid. If this happens, contact the developer of this library.')
    }

    if (!options.uploadURL) {
      throw new Error('CS0015: Invalid upload URL')
    }

    if (!options.driver) {
      throw new Error('CS0016: No network driver specified')
    }

    if (typeof options.totalSize === 'undefined' || options.totalSize === null || isNaN(options.totalSize) || options.totalSize < 1) {
      throw new Error('CS0017: Invalid total size argument')
    }

    this.options = options
  }

  async upload () {
    const retryCurve = [this.options.retryStrategy.retryInterval, ...this.options.retryStrategy.getCurve()]
    let result
    for (let i = 0; i < retryCurve.length; i++) {
      if (i > 0) {
        this.trigger('retry', result)
      }

      result = await this._doUpload()

      if (result.status >= 200 && result.status < 400) {
        this.trigger('ready', result)
        return
      } else {
        if (result.status >= 500) {
          this.trigger('error', result)
          return
        } else {
          await this.options.retryStrategy.wait(retryCurve[i])
        }
      }
    }
    this.trigger('error', result)
  }

  async _doUpload () {
    this.options.driver.setHeaders({
      ...this.options.additionalHeaders
      // 'Content-Range': 'bytes ' + this.options.start + '-' + (this.options.start + this.options.size) + '/' + this.options.totalSize
    })

    if (this.options.contentType !== 'multipart/form-data') {
      this.options.driver.setHeaders({ 'Content-Type': this.options.contentType })
    }

    const data = {
      chunkStart: this.options.start,
      chunkEnd: this.options.start + this.options.size,
      chunkSize: this.options.size,
      chunkCount: this.options.chunkCount,
      totalsize: this.options.totalSize,
      fileName: this.options.fileName,
      fileType: this.options.fileType,
      id: this.options.id,
      index: this.options.index,
      body: {
        fileName: this.options.fileName,
        content: this.options.body
      },
      ...this.options.additionalFields
    }

    const dataBuilder = getDataBuilder(data, this.options.contentType)

    return { ...data, ...await this.options.driver.upload(this.options.uploadURL, dataBuilder.build()) }
  }
}
