export class BaseRetryStrategy {
  constructor (retryTimes = 1, retryInterval = 1000) {
    this.retryTimes = retryTimes
    this.retryInterval = retryInterval
  }

  getCurve () {
    const curve = []
    for (let i = 0; i < this.retryTimes; i++) {
      curve.push(this.equation(i + 1))
    }
    return curve
  }

  async wait (time) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), time)
    })
  }

  equation () {
    return this.retryInterval
  }
}

export class NoRetryStrategy extends BaseRetryStrategy {
  constructor () {
    super(0, 0)
  }

  getCurve () {
    return []
  }
}

export class LinearBackOffRetryStrategy extends BaseRetryStrategy {
  equation (iterator) {
    return Math.max(this.retryInterval, iterator * this.retryInterval)
  }
}

export class ExponentialBackOffRetryStrategy extends BaseRetryStrategy {
  equation (iterator) {
    return Math.pow(2, iterator) * this.retryInterval
  }
}
