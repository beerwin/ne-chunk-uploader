import HasEvents from './has-events'

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

    if (!this.options.contentType) {
      this.options.contentType = 'multipart/form-data'
    }
  }

  async upload () {
    await this._doUpload()
  }

  async _doUpload () {
    this.options.driver.setHeaders({
      'Content-Type': this.options.contentType,
      'Content-Range': 'bytes ' + this.options.start + '-' + (this.options.start + this.options.size) + '/' + this.options.totalSize
    })

    const result = await this.options.driver.upload(this.options.uploadURL, {
      chunkStart: this.options.start,
      chunkEnd: this.options.chunkStart + this.options.chunkSize,
      chunkSize: this.options.size,
      totalsize: this.options.totalSize,
      id: this.options.id,
      index: this.options.index,
      body: this.options.body
    })

    if (result.status >= 200 && result.status < 400) {
      this.trigger('ready', result)
    } else {
      this.trigger('error', result)
    }
  }
}
