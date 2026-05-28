import { describe, it, expect } from 'vitest'
import { isValidEmail } from './validations'

describe('isValidEmail', () => {
  it('accepts a standard email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })

  it('accepts emails with dots, plus signs, and dashes in the local part', () => {
    expect(isValidEmail('first.last+tag@example.co.uk')).toBe(true)
    expect(isValidEmail('a-b_c@sub.example.org')).toBe(true)
  })

  it('accepts uppercase emails (lowercased internally)', () => {
    expect(isValidEmail('USER@EXAMPLE.COM')).toBe(true)
  })

  it('accepts emails with IP-literal domains', () => {
    expect(isValidEmail('user@[127.0.0.1]')).toBe(true)
  })

  it('rejects emails missing the @ sign', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })

  it('rejects emails missing a domain', () => {
    expect(isValidEmail('user@')).toBe(false)
  })

  it('rejects emails missing a local part', () => {
    expect(isValidEmail('@example.com')).toBe(false)
  })

  it('rejects domains without a top-level domain', () => {
    expect(isValidEmail('user@example')).toBe(false)
  })

  it('rejects single-character TLDs', () => {
    expect(isValidEmail('user@example.c')).toBe(false)
  })

  it('rejects whitespace inputs', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('   ')).toBe(false)
    expect(isValidEmail('user @example.com')).toBe(false)
    expect(isValidEmail('user@ example.com')).toBe(false)
  })

  it('rejects unicode characters in the domain part', () => {
    expect(isValidEmail('user@exämple.com')).toBe(false)
  })

  it('accepts unicode characters in the local part (negated-class regex)', () => {
    expect(isValidEmail('üser@example.com')).toBe(true)
  })
})
