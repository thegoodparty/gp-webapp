'use client'

import Image from 'next/image'
import { Share2 } from 'lucide-react'
import { IconButton } from '@styleguide'

interface HeroCardProps {
  candidateName: string
  race: string
  state: string
  electionDate: string
  onShare?: () => void
}

const HeroCard = ({
  candidateName,
  race,
  state,
  electionDate,
  onShare,
}: HeroCardProps): React.JSX.Element => {
  const raceLine = [race, state].filter(Boolean).join(' • ')

  return (
    <section className="relative flex flex-col items-center gap-6 rounded-3xl border border-base-border bg-brand-cream px-6 pt-8 pb-6 text-center sm:px-12 sm:pt-16 sm:pb-12">
      {onShare ? (
        <IconButton
          type="button"
          variant="outline"
          size="medium"
          onClick={onShare}
          aria-label="Share campaign plan"
          className="absolute! top-4 right-4 bg-base-surface sm:top-6 sm:right-6"
        >
          <Share2 className="size-4" />
        </IconButton>
      ) : null}

      <div className="flex flex-col items-center gap-3">
        <Image
          src="/images/heart.svg"
          alt=""
          width={56}
          height={45}
          priority
          className="h-12 w-auto sm:h-14"
        />
        <h1 className="text-3xl font-bold text-foreground sm:text-5xl">
          Initial campaign plan
        </h1>
      </div>

      {candidateName || raceLine || electionDate ? (
        <div className="flex flex-col items-center gap-1">
          {candidateName ? (
            <>
              <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Prepared for
              </p>
              <p className="text-xl font-bold text-foreground sm:text-3xl">
                {candidateName}
              </p>
            </>
          ) : null}
          {raceLine ? (
            <p className="text-base text-muted-foreground sm:text-lg">
              {raceLine}
            </p>
          ) : null}
          {electionDate ? (
            <p className="text-sm text-muted-foreground sm:text-base">
              Election Day: {electionDate}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex w-full flex-col items-center gap-2 border-t border-base-border pt-6">
        <p className="text-sm text-muted-foreground">
          Prepared by GoodParty.org
        </p>
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Empowering people to run, win, and serve
        </p>
      </div>
    </section>
  )
}

export default HeroCard
