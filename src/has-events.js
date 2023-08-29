export default class HasEvents {
  constructor () {
    this.listeners = []
  }

  addEventListener (event, listener) {
    this.listeners.push({
      event,
      listener
    })
  }

  removeEventListener (event, listener) {
    this.listeners = this.listeners.filter(l => !(l.event === event && l.listener === listener))
  }

  async trigger (event, data) {
    const results = []
    this.listeners.filter(l => l.event === event).forEach(async element => {
      results.push(await element.listener(data))
    })
    return results
  }
}
