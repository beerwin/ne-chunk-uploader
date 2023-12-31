export default class FetchDriver {
  constructor () {
    this.headers = {}
  }

  setHeaders (headers) {
    this.headers = { ...this.headers, ...headers }
  }

  async upload (uploadURL, data) {
    let result = await this._doUpload(uploadURL, data)
    if (result.status === 401 && typeof this.onAuthorizationRequest === 'function') {
      this.setHeaders({
        Authorization: await this.onAuthorizationRequest()
      })
      result = this._doUpload(uploadURL, data)
    }

    return result
  }

  async _doUpload (uploadURL, data) {
    try {
      const response = await fetch(uploadURL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: this.headers,
        redirect: 'follow',
        body: data
      })

      if (response.status >= 200 && response.status < 400) {
        return {
          nativeEvent: null,
          nativeResponse: response,
          status: response.status,
          statusText: response.statusText
        }
      } else {
        return {
          nativeEvent: null,
          nativeResponse: response,
          status: response.status,
          statusText: response.statusText
        }
      }
    } catch (e) {
      return {
        nativeEvent: e,
        status: -1,
        statusText: e.message
      }
    }
  }
}
