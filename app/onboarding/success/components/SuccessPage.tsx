'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { Button, Card, CardContent, GoodPartyOrgLogo } from '@styleguide'
import { useCampaign } from '@shared/hooks/useCampaign'
import { CAMPAIGN_QUERY_KEY } from '@shared/hooks/CampaignProvider'
import { useUser } from '@shared/hooks/useUser'
import type { User } from 'helpers/types'
import ConfettiCanvas from './ConfettiCanvas'
import { MOCK_PLAN_SECTIONS } from './mockPlanContent'

interface SuccessPageProps {
  initialUser: User | null
}

const SuccessPage = ({ initialUser }: SuccessPageProps): React.JSX.Element => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [clientUser] = useUser()
  const user = clientUser ?? initialUser
  const [campaign] = useCampaign()

  useEffect(() => {
    void queryClient.invalidateQueries({ queryKey: CAMPAIGN_QUERY_KEY })
  }, [queryClient])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const candidateName = [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ')
    .trim()
  const race =
    campaign?.positionName ||
    campaign?.organization?.customPositionName ||
    campaign?.office ||
    ''

  const handleContinue = () => router.push('/dashboard')

  return (
    <div className="relative min-h-screen w-full bg-base-surface pb-28 text-foreground">
      <div className="pointer-events-none fixed inset-0 z-40">
        <ConfettiCanvas play />
      </div>
      <main className="mx-auto w-full max-w-4xl px-4 pt-4 pb-12 sm:px-8 sm:pt-16 sm:pb-20">
        <div className="relative flex flex-col items-center gap-6 rounded-3xl border border-base-border bg-brand-cream px-6 pt-12 pb-10 text-center sm:px-12 sm:pt-16">
          <GoodPartyOrgLogo className="!h-12 !w-auto sm:!h-14" />
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              Your initial campaign plan
            </h1>
            {candidateName && race ? (
              <p className="text-xl font-bold text-foreground sm:text-2xl">
                {candidateName} for {race}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-12">
          {MOCK_PLAN_SECTIONS.map((section) => (
            <Card key={section.id}>
              <CardContent className="space-y-2 py-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="text-base text-muted-foreground">
                  {section.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 border-t border-base-border bg-base-surface">
        <div className="mx-auto flex h-20 w-full max-w-4xl items-center justify-end gap-3 px-4 sm:px-8">
          <Button
            type="button"
            variant="default"
            size="large"
            onClick={handleContinue}
          >
            Campaign manager
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
