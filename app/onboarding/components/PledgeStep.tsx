'use client'

import { Flag, User, UsersRound } from 'lucide-react'
import { Card, CardContent } from '@styleguide'
import { getMarketingUrl } from 'helpers/linkhelper'

const PLEDGE_ITEMS = [
  {
    title: 'Independent',
    Icon: User,
    body: 'I am on the ballot as a nonpartisan, independent, or third-party candidate. I don\u2019t serve on any boards or organizations affiliated with the Democratic or Republican parties.',
  },
  {
    title: 'People-Powered',
    Icon: UsersRound,
    body: 'I will focus on solving the problems facing my community, not serving myself or special interests. I will disclose donors and ensure that most of my funding comes from individual donors, not from corporations, unions or other special interests.',
  },
  {
    title: 'Anti-Corruption',
    Icon: Flag,
    body: 'I will uphold the highest level of integrity by being open, transparent and accountable about my positions and progress on issues. This means staying connected to, informed by, and responsive to all my constituents using modern tools and data to inform decisions.',
  },
] as const

export const PledgeStep = (): React.JSX.Element => (
  <Card className="rounded-2xl border-base-border shadow-none">
    <CardContent className="space-y-6 px-6 py-2 sm:px-8 sm:py-3">
      <p className="text-2xl font-semibold leading-[1.08] text-foreground">
        I pledge to be...
      </p>

      <ul className="space-y-6">
        {PLEDGE_ITEMS.map(({ title, Icon, body }) => (
          <li key={title} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Icon
                className="size-7 shrink-0 text-foreground"
                aria-hidden="true"
              />
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{body}</p>
          </li>
        ))}
      </ul>

      <p className="border-t border-base-border pt-4 text-xs text-muted-foreground">
        By continuing, you agree to run a civil campaign focused on issues, not
        mudslinging or ad hominem attacks; also accepting GoodParty.org&apos;s{' '}
        <a
          href={getMarketingUrl('/terms-of-service')}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href={getMarketingUrl('/privacy')}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Privacy Policy
        </a>
        .
      </p>
    </CardContent>
  </Card>
)
