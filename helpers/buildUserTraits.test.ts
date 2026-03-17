import { buildUserTraits } from './buildUserTraits'
import { User, UserRole } from './types'

const baseUser: User = {
  id: 1,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  email: 'test@example.com',
  roles: [UserRole.candidate],
  hasPassword: true,
}

describe('buildUserTraits', () => {
  it('includes all fields when user has all optional fields', () => {
    const user: User = {
      ...baseUser,
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '555-1234',
      zip: '90210',
    }

    expect(buildUserTraits(user)).toEqual({
      email: 'test@example.com',
      name: 'Jane Doe',
      phone: '555-1234',
      zip: '90210',
    })
  })

  it('does not produce "null" in name when firstName and lastName are null', () => {
    const user: User = {
      ...baseUser,
      firstName: null,
      lastName: null,
    }

    const traits = buildUserTraits(user)
    expect(traits.name).toBeUndefined()
    expect(traits).toEqual({ email: 'test@example.com' })
  })

  it('builds name from firstName only when lastName is null', () => {
    const user: User = {
      ...baseUser,
      firstName: 'Jane',
      lastName: null,
    }

    expect(buildUserTraits(user)).toEqual({
      email: 'test@example.com',
      name: 'Jane',
    })
  })

  it('builds name from lastName only when firstName is null', () => {
    const user: User = {
      ...baseUser,
      firstName: null,
      lastName: 'Doe',
    }

    expect(buildUserTraits(user)).toEqual({
      email: 'test@example.com',
      name: 'Doe',
    })
  })

  it('omits phone and zip when they are not set', () => {
    const user: User = {
      ...baseUser,
      firstName: 'Jane',
      lastName: 'Doe',
    }

    const traits = buildUserTraits(user)
    expect(traits).toEqual({
      email: 'test@example.com',
      name: 'Jane Doe',
    })
    expect(traits).not.toHaveProperty('phone')
    expect(traits).not.toHaveProperty('zip')
  })
})
