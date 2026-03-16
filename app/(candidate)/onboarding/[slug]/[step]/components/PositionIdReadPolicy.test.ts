import { describe, it, expect } from 'vitest'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const filesToCheck = [
  'app/(candidate)/onboarding/[slug]/[step]/components/OfficeStep.tsx',
  'app/(candidate)/onboarding/[slug]/[step]/components/ballotOffices/BallotRaces.tsx',
  'app/(candidate)/onboarding/[slug]/[step]/components/ballotOffices/CustomOfficeForm.tsx',
]

describe('onboarding details.positionId read policy', () => {
  it('does not read campaign.details.positionId in onboarding components', async () => {
    const patterns = [
      /campaign\??\.details\??\.positionId/g,
      /updated\.details\.positionId/g,
    ]

    for (const relativePath of filesToCheck) {
      const absolutePath = path.resolve(process.cwd(), relativePath)
      const content = await readFile(absolutePath, 'utf-8')

      for (const pattern of patterns) {
        expect(content).not.toMatch(pattern)
      }
    }
  })
})
