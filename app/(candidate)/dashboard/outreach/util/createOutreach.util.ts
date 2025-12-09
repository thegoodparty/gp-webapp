import { OUTREACH_TYPE_MAPPING } from 'app/(candidate)/dashboard/outreach/constants'
import { faker } from '@faker-js/faker'

interface VoterFileFilter {
  id: number
  createdAt: string
  updatedAt: string
  name: string
  audienceSuperVoters: boolean
  audienceLikelyVoters: boolean
  audienceUnreliableVoters: boolean
  audienceUnlikelyVoters: boolean
  audienceFirstTimeVoters: boolean
  partyIndependent: boolean
  partyDemocrat: boolean
  partyRepublican: boolean
  age18_25: boolean
  age25_35: boolean
  age35_50: boolean
  age50Plus: boolean
  genderMale: boolean
  genderFemale: boolean
  voterCount: number
  campaignId: string | number
}

interface Outreach {
  id: number
  createdAt: string
  updatedAt: string
  campaignId: string | number
  outreachType: string
  projectId: string
  name: string
  status: string
  error: null
  audienceRequest: string
  script: string
  message: string
  date: string
  imageUrl: string
  voterFileFilter: VoterFileFilter
}

export const createOutreach = (campaignId: string | number): Outreach => {
  const outreachTypes = Object.keys(OUTREACH_TYPE_MAPPING)
  const outreachType = faker.helpers.arrayElement(outreachTypes)
  const now = faker.date.recent()
  const voterFileFilter: VoterFileFilter = {
    id: faker.number.int({ min: 100, max: 999 }),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    name: faker.lorem.words(2),
    audienceSuperVoters: faker.datatype.boolean(),
    audienceLikelyVoters: faker.datatype.boolean(),
    audienceUnreliableVoters: faker.datatype.boolean(),
    audienceUnlikelyVoters: faker.datatype.boolean(),
    audienceFirstTimeVoters: faker.datatype.boolean(),
    partyIndependent: faker.datatype.boolean(),
    partyDemocrat: faker.datatype.boolean(),
    partyRepublican: faker.datatype.boolean(),
    age18_25: faker.datatype.boolean(),
    age25_35: faker.datatype.boolean(),
    age35_50: faker.datatype.boolean(),
    age50Plus: faker.datatype.boolean(),
    genderMale: faker.datatype.boolean(),
    genderFemale: faker.datatype.boolean(),
    voterCount: faker.number.int({ min: 10, max: 500000 }),
    campaignId,
  }
  return {
    id: faker.number.int({ min: 1, max: 9999 }),
    createdAt: faker.date.past().toISOString(),
    updatedAt: now.toISOString(),
    campaignId,
    outreachType,
    projectId: faker.string.uuid(),
    name: faker.company.name(),
    status: faker.helpers.arrayElement([
      'pending',
      'approved',
      'in_progress',
      'completed',
      'paid',
    ]),
    error: null,
    audienceRequest: faker.lorem.sentence(),
    script: faker.lorem.sentence(),
    message: faker.lorem.sentence(),
    date: faker.date.future().toISOString(),
    imageUrl: faker.image.urlPicsumPhotos(),
    voterFileFilter,
  }
}
