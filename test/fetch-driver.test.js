import fetchMock from 'jest-fetch-mock'
import { beforeEach } from 'node:test'
import { requestFail, requestRedirected, requestStatusError, requestSuccess, requestStatusBadRequest, requestStatusNotFound, requestStatusAuthorizationRequired } from './mock/fetch'

import { describe, test, expect, jest } from '@jest/globals'
import FetchDriver from '../src/transfer-drivers/fetch-driver'

fetchMock.enableMocks()

beforeEach(() => {
  fetch.resetMocks()
})

describe('FetchDriver', () => {
  test('successful request', async () => {
    fetch.mockResponse(requestSuccess)
    const driver = new FetchDriver()
    const result = await driver.upload('http://localhost', { something: true })
    expect(result.status).toBe(200)
  })

  test('redirected request', async () => {
    fetch.mockResponse(requestRedirected)
    const driver = new FetchDriver()
    const result = await driver.upload('http://localhost', { something: true })
    expect(result.status).toBe(301)
  })

  test('failed request', async () => {
    fetch.mockReject(requestFail)
    const driver = new FetchDriver()
    const result = await driver.upload('http://localhost', { something: true })
    expect(result.status).toBe(-1)
  })

  test('not found request', async () => {
    fetch.mockResponse(requestStatusNotFound)
    const driver = new FetchDriver()
    const result = await driver.upload('http://localhost', { something: true })
    expect(result.status).toBe(404)
  })

  test('bad request', async () => {
    fetch.mockResponse(requestStatusBadRequest)
    const driver = new FetchDriver()
    const result = await driver.upload('http://localhost', { something: true })
    expect(result.status).toBe(400)
  })

  test('error request', async () => {
    fetch.mockResponse(requestStatusError)
    const driver = new FetchDriver()
    const result = await driver.upload('http://localhost', { something: true })
    expect(result.status).toBe(500)
  })

  test('authorization required request', async () => {
    fetch.mockResponse(requestStatusAuthorizationRequired)
    const mockedAuthorizationRequest = {
      requireAuthorization: async () => 'bearer hahaha'
    }
    const spy = jest.spyOn(mockedAuthorizationRequest, 'requireAuthorization')
    const driver = new FetchDriver()
    driver.onAuthorizationRequest = mockedAuthorizationRequest.requireAuthorization
    const result = await driver.upload('http://localhost', { something: true })
    expect(result.status).toBe(401)
    expect(spy).toHaveBeenCalled()
  })
})
