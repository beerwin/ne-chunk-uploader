import { describe, test, expect } from '@jest/globals'

import NEChunkUploader from '../src/chunk-uploader'
import { Blob } from 'buffer'

import fetchMock from 'jest-fetch-mock'
import { beforeEach } from 'node:test'
import { requestFail, requestRedirected, requestStatusError, requestSuccess } from './mock/fetch'
import { LinearBackOffRetryStrategy } from '../src/retry/retries'

const mockData = new Blob([new ArrayBuffer(10485760)], { type: 'application/octet-stream' })

fetchMock.enableMocks()

beforeEach(() => {
  fetch.resetMocks()
})

describe('ChunkUploader', () => {
  test('should run', async () => {
    fetch.mockResponse(requestSuccess)
    const chunkProgresses = []
    const file = mockData
    const chunkUploader = new NEChunkUploader({
      uploadChunkURL: 'http://localhost',
      file,
      chunkSize: 500000
    })

    chunkUploader.addEventListener('progress', (data) => {
      chunkProgresses.push(data)
    })

    await chunkUploader.upload()
    expect(chunkProgresses.length).toBe(22)
    const totalChunkSize = chunkProgresses.reduce((a, c) => {
      if (c.chunksUploaded === 0) {
        return a
      }
      return a + c.chunkSize
    }, 0)
    expect(totalChunkSize).toBe(file.size)
  })

  test('should run with redirected', async () => {
    fetch.mockResponse(requestRedirected)
    const chunkProgresses = []
    const file = mockData
    const chunkUploader = new NEChunkUploader({
      uploadChunkURL: 'http://localhost',
      file,
      chunkSize: 500000
    })

    chunkUploader.addEventListener('progress', (data) => {
      chunkProgresses.push(data)
    })

    await chunkUploader.upload()
    expect(chunkProgresses.length).toBe(22)
    const totalChunkSize = chunkProgresses.reduce((a, c) => {
      if (c.chunksUploaded === 0) {
        return a
      }
      return a + c.chunkSize
    }, 0)
    expect(totalChunkSize).toBe(file.size)
  })

  test('No chunkUploadUrl should fail', () => {
    const file = mockData
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new NEChunkUploader({
        file
      })
    }).toThrow(Error)
  })

  test('No file should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new NEChunkUploader({
        uploadChunkURL: 'https://localhost'
      })
    }).toThrow(Error)
  })

  test('Aborted should interrupt and trigger aborted event', async () => {
    fetch.mockResponse(requestSuccess)
    const chunkProgresses = []
    let aborted = false
    const error = false
    const file = mockData
    const chunkUploader = new NEChunkUploader({
      uploadChunkURL: 'http://localhost',
      file,
      chunkSize: 500000
    })

    chunkUploader.addEventListener('progress', (data) => {
      chunkProgresses.push(data)
    })

    chunkUploader.addEventListener('abort', () => {
      aborted = true
    })

    setTimeout(() => {
      chunkUploader.abort()
    }, 100)

    await chunkUploader.upload()
    expect(chunkProgresses.length).not.toBe(22)
    expect(aborted).toBe(true)
    expect(error).toBe(false)
  })

  test('should retry on non-Http error', async () => {
    fetch.mockReject(requestFail)
    const chunkProgresses = []
    let aborted = false
    let error = true
    let retries = 0
    const file = mockData
    const chunkUploader = new NEChunkUploader({
      uploadChunkURL: 'http://localhost',
      file,
      chunkSize: 500000,
      retryStrategy: new LinearBackOffRetryStrategy(2, 1000)
    })

    chunkUploader.addEventListener('progress', (data) => {
      chunkProgresses.push(data)
    })

    chunkUploader.addEventListener('abort', () => {
      aborted = true
    })

    chunkUploader.addEventListener('error', (data) => {
      error = data
    })

    chunkUploader.addEventListener('chunkRetry', (data) => {
      retries += 1
    })

    await chunkUploader.upload()
    expect(chunkProgresses.length).not.toBe(20)
    expect(aborted).toBe(true)
    expect(error).not.toBe(true)
    expect(error.error.status).toBe(-1)
    expect(retries).toBe(2)
  })

  test('should load basic driver', () => {
    const file = mockData
    const chunkUploader = new NEChunkUploader({
      uploadChunkURL: 'http://localhost',
      file,
      chunkSize: 500000
    })

    expect(typeof chunkUploader.getDriver()).toBe('object')
    expect(typeof chunkUploader.getDriver().upload).toBe('function')
  })

  test('should stop on HTTP errors', async () => {
    fetch.mockResponse(requestStatusError)
    const chunkProgresses = []
    let aborted = false
    let error = false
    const file = mockData
    const chunkUploader = new NEChunkUploader({
      uploadChunkURL: 'http://localhost',
      file,
      chunkSize: 500000
    })

    chunkUploader.addEventListener('progress', (data) => {
      chunkProgresses.push(data)
    })

    chunkUploader.addEventListener('abort', () => {
      aborted = true
    })

    chunkUploader.addEventListener('error', () => {
      error = true
    })

    setTimeout(() => {
      chunkUploader.abort()
    }, 100)

    await chunkUploader.upload()
    expect(chunkProgresses.length).not.toBe(22)
    expect(aborted).toBe(true)
    expect(error).toBe(true)
  })

  test('should run with appplication/json', async () => {
    fetch.mockResponse(requestSuccess)
    const chunkProgresses = []
    const file = mockData
    const chunkUploader = new NEChunkUploader({
      uploadChunkURL: 'http://localhost',
      file,
      chunkSize: 500000,
      contentType: 'application/json'
    })

    chunkUploader.addEventListener('progress', (data) => {
      chunkProgresses.push(data)
    })

    await chunkUploader.upload()
    expect(chunkProgresses.length).toBe(22)
    const totalChunkSize = chunkProgresses.reduce((a, c) => {
      if (c.chunksUploaded === 0) {
        return a
      }
      return a + c.chunkSize
    }, 0)
    expect(totalChunkSize).toBe(file.size)
  })
})
