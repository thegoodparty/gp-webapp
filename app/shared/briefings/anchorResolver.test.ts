import { describe, expect, it } from 'vitest'
import { EMPTY_ANCHOR } from './anchorResolver'

describe('EMPTY_ANCHOR', () => {
  it('is frozen so consumers cannot mutate the shared sentinel', () => {
    expect(Object.isFrozen(EMPTY_ANCHOR)).toBe(true)
    expect(() => {
      EMPTY_ANCHOR.jsonPath = 'evil'
    }).toThrow()
  })
})
