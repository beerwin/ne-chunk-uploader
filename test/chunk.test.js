import { describe, test, expect } from '@jest/globals'
import Chunk from '../src/chunk'

describe('Chunk constructor test', () => {
  test('undefined start should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({

      })
    }).toThrow('CS0010: Invalid chunk start argument')
  })

  test('undefined start should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: null
      })
    }).toThrow('CS0010: Invalid chunk start argument')
  })

  test('Non-numeric start should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 'TEST'
      })
    }).toThrow('CS0010: Invalid chunk start argument')
  })

  test('Negative start should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 'TEST'
      })
    }).toThrow('CS0010: Invalid chunk start argument')
  })

  test('Undefined size should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0
      })
    }).toThrow('CS0011: Invalid chunk size argument')
  })

  test('Null size should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: null
      })
    }).toThrow('CS0011: Invalid chunk size argument')
  })

  test('Non-numeric size should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: null
      })
    }).toThrow('CS0011: Invalid chunk size argument')
  })

  test('Negative size should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: -1
      })
    }).toThrow('CS0011: Invalid chunk size argument')
  })

  test('No body should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: 20
      })
    }).toThrow('CS0012: A chunk body must be specified (No data to upload).')
  })

  test('No id should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: 20,
        body: new Blob(Buffer.from('12345678901234567890'))
      })
    }).toThrow('CS0013: The upload must have an ID. This helps identifying the chunks')
  })

  test('Undefined index should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: 20,
        body: new Blob(Buffer.from('12345678901234567890')),
        id: '1111'
      })
    }).toThrow('CS0014: The chunk index is invalid. If this happens, contact the developer of this library.')
  })

  test('Null index should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: 20,
        body: new Blob(Buffer.from('12345678901234567890')),
        id: '1111',
        index: null
      })
    }).toThrow('CS0014: The chunk index is invalid. If this happens, contact the developer of this library.')
  })

  test('Non-numeric index should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: 20,
        body: new Blob(Buffer.from('12345678901234567890')),
        id: '1111',
        index: 'TEST'
      })
    }).toThrow('CS0014: The chunk index is invalid. If this happens, contact the developer of this library.')
  })

  test('Negative index should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: 20,
        body: new Blob(Buffer.from('12345678901234567890')),
        id: '1111',
        index: -1
      })
    }).toThrow('CS0014: The chunk index is invalid. If this happens, contact the developer of this library.')
  })

  test('no uploadURL should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: 20,
        body: new Blob(Buffer.from('12345678901234567890')),
        id: '1111',
        index: 0
      })
    }).toThrow('CS0015: Invalid upload URL')
  })

  test('no driver should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: 20,
        body: new Blob(Buffer.from('12345678901234567890')),
        id: '1111',
        index: 0,
        uploadURL: 'http://localhost'
      })
    }).toThrow('CS0016: No network driver specified')
  })

  test('no total size should fail', () => {
    expect(() => {
      // eslint-disable-next-line no-unused-vars
      const c = new Chunk({
        start: 0,
        size: 20,
        body: new Blob(Buffer.from('12345678901234567890')),
        id: '1111',
        index: 0,
        uploadURL: 'http://localhost',
        driver: {}
      })
    }).toThrow('CS0017: Invalid total size argument')
  })
})
