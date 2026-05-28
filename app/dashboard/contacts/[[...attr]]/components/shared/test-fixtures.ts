import type { Person } from './contacts-types'

/**
 * Canonical Person factory for contacts unit tests. Defaults to a
 * `voterStatus` of `null` (the most common state in production data);
 * tests that need a specific status should pass it via `overrides`.
 *
 * This file is imported only from `*.test.tsx` files and is not used
 * in production code.
 */
export function makePerson(overrides: Partial<Person> = {}): Person {
  return {
    id: 'p_1',
    lalVoterId: 'lal_1',
    firstName: 'Jane',
    middleName: null,
    lastName: 'Doe',
    nameSuffix: null,
    age: 42,
    state: 'CA',
    address: {
      line1: '123 Main St',
      line2: null,
      city: 'Townsville',
      state: 'CA',
      zip: '90210',
      zipPlus4: null,
      latitude: null,
      longitude: null,
    },
    cellPhone: '555-0100',
    landline: '555-0101',
    gender: 'Female',
    politicalParty: 'Independent',
    registeredVoter: 'Yes',
    estimatedIncomeAmount: null,
    voterStatus: null,
    maritalStatus: null,
    hasChildrenUnder18: null,
    veteranStatus: null,
    homeowner: null,
    businessOwner: null,
    levelOfEducation: null,
    ethnicityGroup: null,
    language: 'English',
    ...overrides,
  }
}
