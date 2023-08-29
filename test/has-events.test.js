import { jest, test, describe, expect } from '@jest/globals'

import HasEvents from '../src/has-events'

describe('has-events', () => {
  test('addEventListener', () => {
    const he = new HasEvents()
    he.addEventListener('something', () => {
      expect(1).toBe(1)
    })
    he.trigger('something')
  })

  test('removeEventListener', () => {
    const s = {
      callee: () => {}
    }
    const he = new HasEvents()
    he.addEventListener('something', s.callee)
    const spiedCallee2 = jest.spyOn(s, 'callee')
    he.removeEventListener('something', s.callee)
    he.trigger('something')
    expect(spiedCallee2).not.toHaveBeenCalled()
  })
})
