import { describe, test, expect } from '@jest/globals'
import { BaseRetryStrategy, ExponentialBackOffRetryStrategy, LinearBackOffRetryStrategy, NoRetryStrategy } from '../src/retry/retries'

describe('BaseRetryStrategy', () => {
  test('should be one 1000', () => {
    const strategy = new BaseRetryStrategy(1, 1000)
    const curve = strategy.getCurve()
    expect(curve).toEqual([1000])
  })

  test('should be 3 times 2000', () => {
    const strategy = new BaseRetryStrategy(3, 2000)
    const curve = strategy.getCurve()
    expect(curve).toEqual([2000, 2000, 2000])
  })
})

describe('LinearBackOffRetryStrategy', () => {
  test('should be one 1000', () => {
    const strategy = new LinearBackOffRetryStrategy(1, 1000)
    const curve = strategy.getCurve()
    expect(curve).toEqual([1000])
  })

  test('should be 3 times 2000', () => {
    const strategy = new LinearBackOffRetryStrategy(4, 2000)
    const curve = strategy.getCurve()
    expect(curve).toEqual([2000, 4000, 6000, 8000])
  })
})

describe('ExponentialBackOffRetryStrategy', () => {
  test('should be one 1000', () => {
    const strategy = new ExponentialBackOffRetryStrategy(1, 1000)
    const curve = strategy.getCurve()
    expect(curve).toEqual([2000])
  })

  test('should be 3 times 2000', () => {
    const strategy = new ExponentialBackOffRetryStrategy(3, 2000)
    const curve = strategy.getCurve()
    expect(curve).toEqual([4000, 8000, 16000])
  })
})

describe('Waits', () => {
  test('waits specified milliseconds', async () => {
    const strategy = new BaseRetryStrategy(1, 1000)
    const time = (new Date()).getTime()
    await strategy.wait(1000)
    const time2 = (new Date()).getTime()
    expect(time2 - time).toBeGreaterThanOrEqual(1000)
    expect(time2 - time).toBeLessThan(1010)
  })
})

describe('NoRetryStrategy', () => {
  test('should be empty', () => {
    const strategy = new NoRetryStrategy()
    const curve = strategy.getCurve()
    expect(curve).toEqual([])
  })

  test('should be 3 times 2000', () => {
    const strategy = new NoRetryStrategy(3, 2000)
    const curve = strategy.getCurve()
    expect(curve).toEqual([])
  })
})
