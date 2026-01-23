import { faker } from '@faker-js/faker'
import { Outreach } from '../hooks/OutreachContext'

type OutreachType = 'text' | 'doorKnocking' | 'phoneBanking' | 'socialMedia' | 'robocall' | 'p2p'
type OutreachStatus = 'pending' | 'approved' | 'denied' | 'paid' | 'in_progress' | 'completed'
const OUTREACH_TYPES: OutreachType[] = ['text', 'doorKnocking', 'phoneBanking', 'socialMedia', 'robocall', 'p2p']
const OUTREACH_STATUSES: OutreachStatus[] = ['pending', 'approved', 'in_progress', 'completed', 'paid']

export const createOutreach = (campaignId: number): Outreach => {
  const outreachType = faker.helpers.arrayElement(OUTREACH_TYPES)
  const status = faker.helpers.arrayElement(OUTREACH_STATUSES)
  const now = faker.date.recent()
  return {
    id: faker.number.int({ min: 1, max: 9999 }),
    createdAt: faker.date.past().toISOString(),
    updatedAt: now.toISOString(),
    campaignId,
    outreachType,
    projectId: faker.string.uuid(),
    name: faker.company.name(),
    status,
    error: null,
    audienceRequest: faker.lorem.sentence(),
    script: faker.lorem.sentence(),
    message: faker.lorem.sentence(),
    date: faker.date.future().toISOString(),
    imageUrl: faker.image.urlPicsumPhotos(),
    voterFileFilterId: faker.number.int({ min: 100, max: 999 }),
  }
}
