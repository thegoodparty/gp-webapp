import { describe, it, expect } from 'vitest'
import { URLSearchParamsToObject } from './URLSearchParamsToObject'

describe('URLSearchParamsToObject', () => {
  it('returns an empty object for empty params', () => {
    expect(URLSearchParamsToObject(new URLSearchParams())).toEqual({})
  })

  it('maps single-occurrence keys to string values', () => {
    const params = new URLSearchParams('a=1&b=hello')
    expect(URLSearchParamsToObject(params)).toEqual({ a: '1', b: 'hello' })
  })

  it('promotes a duplicated key to a string array', () => {
    const params = new URLSearchParams('tag=foo&tag=bar')
    expect(URLSearchParamsToObject(params)).toEqual({ tag: ['foo', 'bar'] })
  })

  it('appends to the existing array on third and later occurrences', () => {
    const params = new URLSearchParams('tag=a&tag=b&tag=c&tag=d')
    expect(URLSearchParamsToObject(params)).toEqual({
      tag: ['a', 'b', 'c', 'd'],
    })
  })

  it('handles a mix of single-value and multi-value keys', () => {
    const params = new URLSearchParams('id=42&tag=a&tag=b&q=hello')
    expect(URLSearchParamsToObject(params)).toEqual({
      id: '42',
      tag: ['a', 'b'],
      q: 'hello',
    })
  })

  it('preserves empty-string values', () => {
    const params = new URLSearchParams('a=&b=value')
    expect(URLSearchParamsToObject(params)).toEqual({ a: '', b: 'value' })
  })

  it('preserves insertion order of duplicated keys', () => {
    const params = new URLSearchParams('first=a&second=b&first=c')
    expect(URLSearchParamsToObject(params)).toEqual({
      first: ['a', 'c'],
      second: 'b',
    })
  })
})
