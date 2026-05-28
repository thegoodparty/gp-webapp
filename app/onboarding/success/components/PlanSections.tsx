'use client'

import { Skeleton, SourceCitation } from '@styleguide'
import { VoterDemographicsStep } from 'app/onboarding/components/VoterDemographicsStep'
import PlanSectionNav, { type PlanSectionRef } from './PlanSectionNav'
import type { PlanData } from './planContent'

interface StrategyState {
  isGenerating: boolean
  isError: boolean
}

interface VoterInsightsContext {
  ballotReadyPositionId?: string
  city?: string
  state?: string
  office?: string
}

const GoodPartySourceLogo = (): React.JSX.Element => (
  <img
    src="/images/logo/heart.svg"
    alt=""
    aria-hidden="true"
    className="size-full object-contain"
  />
)

interface PlanSectionsProps {
  plan: PlanData
  strategyState?: StrategyState
  onStuckChange?: (stuck: boolean) => void
  voterInsightsContext?: VoterInsightsContext
}

interface SectionProps {
  id: string
  number: number
  title: string
  children: React.ReactNode
  transition?: React.ReactNode
}

const Section = ({
  id,
  number,
  title,
  children,
  transition,
}: SectionProps): React.JSX.Element => (
  <section id={id} className="scroll-mt-24">
    <header className="mb-2 space-y-2">
      <p className="text-xs font-semibold tracking-widest text-components-input-active uppercase">
        Section {number}
      </p>
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
        {title}
      </h2>
    </header>
    <div className="space-y-6 text-left">{children}</div>
    {transition ? (
      <>
        <hr className="mt-8 border-t border-base-border" />
        <p className="mt-8 text-sm text-muted-foreground">{transition}</p>
      </>
    ) : null}
  </section>
)

const PLAN_SECTIONS: PlanSectionRef[] = [
  { id: 'plan-section-1', label: '1. Executive Summary' },
  { id: 'plan-section-2', label: '2. Strategic Landscape' },
  { id: 'plan-section-3', label: '3. Electoral Goals & Key Metrics' },
  { id: 'plan-section-4', label: '4. Voter Insights For Your District' },
  { id: 'plan-section-5', label: '5. Projected Minimum Resources Needed' },
  { id: 'plan-section-6', label: '6. Campaign Timeline' },
  { id: 'plan-section-7', label: '7. Community Engagement & Earned Media' },
  { id: 'plan-section-8', label: '8. Voter Contact Plan' },
  { id: 'plan-section-9', label: '9. Measurement & Accountability' },
  { id: 'plan-section-10', label: '10. Methodology & Data Sources' },
  { id: 'plan-section-11', label: '11. Glossary' },
]

interface SubsectionProps {
  title: string
  children: React.ReactNode
}

const Subsection = ({
  title,
  children,
}: SubsectionProps): React.JSX.Element => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    <div className="space-y-3 text-sm text-foreground">{children}</div>
  </div>
)

interface DefinitionListProps {
  items: { title: string; body: string }[]
}

const DefinitionList = ({ items }: DefinitionListProps): React.JSX.Element => (
  <ul className="space-y-1.5 text-sm">
    {items.map((item) => (
      <li key={item.title}>
        <span className="font-semibold text-foreground">{item.title}</span>{' '}
        <span className="text-muted-foreground">{item.body}</span>
      </li>
    ))}
  </ul>
)

interface KeyValueTableProps {
  rows: { label: string; value: string }[]
}

const KeyValueTable = ({ rows }: KeyValueTableProps): React.JSX.Element => (
  <dl className="divide-y divide-base-border rounded-xl border border-base-border">
    {rows.map((row) => (
      <div
        key={row.label}
        className="grid grid-cols-1 gap-2 px-4 py-4 text-sm md:grid-cols-[200px_1fr] md:gap-6"
      >
        <dt className="text-muted-foreground">{row.label}</dt>
        <dd className="font-semibold text-foreground">{row.value}</dd>
      </div>
    ))}
  </dl>
)

interface PlanTableProps {
  columns: string[]
  rows: (string | React.ReactNode)[][]
}

const PlanTable = ({ columns, rows }: PlanTableProps): React.JSX.Element => (
  <div className="overflow-x-auto rounded-xl border border-base-border">
    <table className="w-full text-left text-sm">
      <thead className="bg-muted">
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-4 py-3 font-semibold text-foreground">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-base-border">
        {rows.map((row, rIdx) => (
          <tr key={rIdx}>
            {row.map((cell, cIdx) => (
              <td key={cIdx} className="px-4 py-3 align-top text-foreground">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

// "The Race" subsection has 3 variants per the source doc: uncontested,
// ≥1 opponent (no incumbent), and ≥1 opponent with incumbent.
const TheRaceCopy = ({ plan }: { plan: PlanData }): React.JSX.Element => {
  const districtFragment = plan.hasDistrict ? (
    <>
      {' '}
      representing{' '}
      <span className="font-semibold text-foreground">{plan.districtName}</span>
    </>
  ) : null

  const electionTypeLabel =
    plan.electionType === 'partisan'
      ? 'partisan'
      : plan.electionType === 'nonpartisan'
      ? 'nonpartisan'
      : null

  const electionTypeFragment = electionTypeLabel ? (
    <>
      a{' '}
      <span className="font-semibold text-foreground">{electionTypeLabel}</span>{' '}
      election{' '}
    </>
  ) : (
    'a race '
  )

  if (plan.opponentCount === 0) {
    return (
      <p>
        You are running for{' '}
        <span className="font-semibold text-foreground">{plan.race}</span>
        {districtFragment}. As of{' '}
        <span className="font-semibold text-foreground">
          {plan.planGenerationDate}
        </span>
        , the race is uncontested — we&apos;ll update this campaign plan as we
        become aware of candidates entering the race. Election Day is{' '}
        <span className="font-semibold text-foreground">
          {plan.electionDate}
        </span>
        . Because the electorate is small and no party cue appears on the
        ballot, the race is decided by name recognition and turnout, not by
        ideological persuasion.
      </p>
    )
  }

  if (plan.incumbent) {
    return (
      <p>
        You are running for{' '}
        <span className="font-semibold text-foreground">{plan.race}</span>
        {districtFragment}. As of{' '}
        <span className="font-semibold text-foreground">
          {plan.planGenerationDate}
        </span>
        , the race is {electionTypeFragment}with{' '}
        <span className="font-semibold text-foreground">
          {plan.opponentCount}{' '}
          {plan.opponentCount === 1 ? 'opponent' : 'opponents'}
        </span>
        , including the incumbent{' '}
        <span className="font-semibold text-foreground">
          {plan.incumbent.fullName}
        </span>
        . Election Day is{' '}
        <span className="font-semibold text-foreground">
          {plan.electionDate}
        </span>
        . Beating an incumbent requires giving voters a concrete reason to
        switch, not just an alternative to choose.
      </p>
    )
  }

  return (
    <p>
      You are running for{' '}
      <span className="font-semibold text-foreground">{plan.race}</span>
      {districtFragment}. As of{' '}
      <span className="font-semibold text-foreground">
        {plan.planGenerationDate}
      </span>
      , the race is {electionTypeFragment}with{' '}
      <span className="font-semibold text-foreground">
        {plan.opponentCount}{' '}
        {plan.opponentCount === 1 ? 'opponent' : 'opponents'}
      </span>
      . Election Day is{' '}
      <span className="font-semibold text-foreground">{plan.electionDate}</span>
      . Because the electorate is small and no party cue appears on the ballot,
      the race is decided by name recognition and turnout, not by ideological
      persuasion.
    </p>
  )
}

// Opposition Research has 4 doc variants based on opponent count + filing-date
// availability.
const OppositionResearch = ({
  plan,
}: {
  plan: PlanData
}): React.JSX.Element => {
  if (plan.opponentCount === 0) {
    if (plan.filingDateStart && plan.filingDateEnd) {
      return (
        <p>
          Candidates begin filing on{' '}
          <span className="font-semibold text-foreground">
            {plan.filingDateStart}
          </span>{' '}
          and the filing window closes on{' '}
          <span className="font-semibold text-foreground">
            {plan.filingDateEnd}
          </span>
          . Before{' '}
          <span className="font-semibold text-foreground">
            {plan.filingDateStart}
          </span>
          , we don&apos;t yet know who will be on the ballot with you, so this
          section is a placeholder. We&apos;ll automatically check for new
          filings starting on{' '}
          <span className="font-semibold text-foreground">
            {plan.filingDateStart}
          </span>{' '}
          and update this section as candidates enter the race. If you hear of a
          likely opponent before we do, you can flag them in Campaign Manager.
        </p>
      )
    }
    if (plan.filingDateEnd) {
      return (
        <p>
          The filing deadline for this race is on{' '}
          <span className="font-semibold text-foreground">
            {plan.filingDateEnd}
          </span>
          . We don&apos;t yet have a complete picture of who will be on the
          ballot with you, but we&apos;ll automatically check for new filings
          and update this section as candidates enter the race.
        </p>
      )
    }
    return (
      <p>
        We&apos;ll automatically check for opponents and update this section as
        we become aware of candidates entering the race.
      </p>
    )
  }

  return (
    <ul className="space-y-6 text-sm">
      {plan.opponents.map((opp) => (
        <li key={opp.fullName} className="space-y-2">
          <p className="font-semibold text-foreground">{opp.fullName}</p>
          <ul className="space-y-1 pl-5 text-muted-foreground [list-style:disc]">
            {opp.partyAffiliation ? (
              <li>Party: {opp.partyAffiliation}</li>
            ) : null}
            {opp.incumbent === true ? <li>Incumbent</li> : null}
            {opp.politicalSummary ? <li>{opp.politicalSummary}</li> : null}
            {opp.keyFacts.length > 0 ? (
              <li>
                Key facts:
                <ul className="mt-1 space-y-1 pl-5 [list-style:circle]">
                  {opp.keyFacts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
              </li>
            ) : null}
            {opp.websites.length > 0 ? (
              <li>
                Websites:
                <ul className="mt-1 space-y-1 pl-5 [list-style:circle]">
                  {opp.websites.map((w) => (
                    <li key={w}>
                      <a
                        href={w}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-components-input-active hover:underline"
                      >
                        {w}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : null}
          </ul>
        </li>
      ))}
    </ul>
  )
}

// Renders the three Section 2 subsections (Opportunities, Challenges,
// Opposition Research) as skeletons. Used while the strategic-landscape
// endpoint is polling.
const StrategicLandscapeSkeleton = (): React.JSX.Element => (
  <>
    <p className="text-sm text-muted-foreground italic">
      Generating your strategic landscape&hellip; this can take up to a minute.
    </p>
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-4/6 rounded-md" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <Skeleton className="h-4 w-4/6 rounded-md" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="h-5 w-40 rounded-md" />
      <Skeleton className="h-20 w-full rounded-md" />
      <Skeleton className="h-20 w-full rounded-md" />
    </div>
  </>
)

const BulletList = ({ items }: { items: string[] }): React.JSX.Element => (
  <ul className="space-y-1.5 pl-5 text-sm text-muted-foreground [list-style:disc]">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

const districtLabel = (plan: PlanData): string =>
  plan.hasDistrict ? plan.districtName : 'Your district'

const PlanSections = ({
  plan,
  strategyState,
  onStuckChange,
  voterInsightsContext,
}: PlanSectionsProps): React.JSX.Element => {
  const isStrategyGenerating = strategyState?.isGenerating ?? false
  const isStrategyError = strategyState?.isError ?? false
  // Hide section 2 entirely on error (per product decision); keep it in
  // the nav only when we're either showing the skeleton or have data.
  const showSection2 = !isStrategyError
  const navSections = showSection2
    ? PLAN_SECTIONS
    : PLAN_SECTIONS.filter((s) => s.id !== 'plan-section-2')

  return (
    <div className="text-left">
      <PlanSectionNav sections={navSections} onStuckChange={onStuckChange} />

      <div className="mt-8 space-y-12">
        {/* 1. Executive Summary */}
        <Section
          id="plan-section-1"
          number={1}
          title="Executive Summary"
          transition="The race is mapped by your opponents, your projected votes needed to win, and your timeline. What shapes everything else is you: the issues you're running on, the people and money you can mobilize, and where you are right now in your campaign. Continue to your Campaign Manager and we'll help rebuild this plan around you specifically."
        >
          <p className="text-sm text-muted-foreground">
            This is the whole plan in one view. If you read nothing else, read
            this.
          </p>

          <Subsection title="The Race">
            <TheRaceCopy plan={plan} />
          </Subsection>

          <Subsection title="Projected Votes Needed to Win">
            <p>
              Our modeling projects voter turnout of{' '}
              <span className="font-semibold text-foreground">
                {plan.projectedTurnout.toLocaleString('en-US')} voters
              </span>{' '}
              (we were within 1.5 percentage points on average), putting the
              threshold for a win at{' '}
              <span className="font-semibold text-foreground">
                {plan.winNumber.toLocaleString('en-US')} votes
              </span>
              , a simple majority of voters (50% + 1) who actually cast a
              ballot. This is the lowest amount of votes we project you need to
              win your election; our campaign plan below will guide you toward
              surpassing that number. Hitting that target requires{' '}
              <span className="font-semibold text-foreground">
                {plan.voterContactGoal.toLocaleString('en-US')} voter contacts
              </span>{' '}
              across the cycle (roughly 5 contacts per targeted voter).
            </p>
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>source:</span>
              <SourceCitation
                organization="Good Party"
                organizationLogo={<GoodPartySourceLogo />}
                title="How GoodParty.org calculates win numbers"
                description="GoodParty.org's methodology for projecting voter turnout and the votes you need to win, calibrated within 1.5 percentage points across recent races."
                url="https://goodparty.org/blog/article/calculate-win-numbers"
              />
            </p>
          </Subsection>

          <Subsection title="Campaign Plan at a Glance">
            <DefinitionList items={plan.planAtAGlance} />
          </Subsection>

          <Subsection title="Key Campaign Targets">
            <p className="text-sm text-muted-foreground">
              These are the targets that will help you keep your campaign on
              track.
            </p>
            <KeyValueTable
              rows={plan.keyCampaignTargets.map((t) => ({
                label: t.metric,
                value: t.target,
              }))}
            />
          </Subsection>

          <Subsection title="Key Dates">
            <ul className="space-y-2 text-sm">
              {plan.keyDates.map((row) => (
                <li key={`${row.date}-${row.description}`}>
                  <span className="font-semibold text-foreground">
                    {row.date}.
                  </span>{' '}
                  <span className="text-muted-foreground">
                    {row.description}
                  </span>
                </li>
              ))}
            </ul>
          </Subsection>
        </Section>

        {/* 2. Strategic Landscape — wired to /campaignStrategy/mine/strategic-landscape */}
        {showSection2 ? (
          <Section
            id="plan-section-2"
            number={2}
            title="Strategic Landscape"
            transition="The strategic landscape is drawn from public data and historical election results. What it can't yet account for is the issues you're championing and how you stack up against your opponents. Head to your Campaign Manager to provide us with that information, and we'll reframe the opportunities and challenges around your platform."
          >
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {districtLabel(plan)}
              </span>{' '}
              is an electorate where name recognition and turnout (not
              ideological persuasion) decide most races. The following
              opportunities and challenges are framed against that reality.
            </p>
            {isStrategyGenerating ? (
              <StrategicLandscapeSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <Subsection title="Opportunities">
                    <BulletList items={plan.opportunities} />
                  </Subsection>
                  <Subsection title="Challenges">
                    <BulletList items={plan.challenges} />
                  </Subsection>
                </div>
                <Subsection title="Opposition Research">
                  <OppositionResearch plan={plan} />
                </Subsection>
              </>
            )}
          </Section>
        ) : null}

        {/* 3. Electoral Goals & Key Metrics */}
        <Section
          id="plan-section-3"
          number={3}
          title="Electoral Goals & Key Metrics"
          transition="These projections come straight from public voter data and proprietary models. Once you confirm your platform issues in Campaign Manager, we can re-forecast against the audience you're actually targeting."
        >
          <p className="text-sm text-muted-foreground">
            The numbers below are projected from historical voter data and
            proprietary models to give you the most accurate projections for{' '}
            <span className="font-semibold text-foreground">
              {districtLabel(plan)}
            </span>
            .
          </p>
          <PlanTable
            columns={['Metric', 'Target', 'Source / Formula']}
            rows={plan.metrics.map((m) => [
              <span key="m" className="text-foreground">
                {m.metric}
              </span>,
              <span key="t" className="font-semibold text-foreground">
                {m.target}
              </span>,
              <span key="s" className="text-muted-foreground">
                {m.source}
              </span>,
            ])}
          />
          <Subsection title="Why 5× the Projected Votes Needed to Win?">
            <p>
              The industry standard convention that a campaign should plan for
              roughly 5 voter contacts per likely voter comes from two
              realities: (1) not every attempt reaches the voter (text
              deliverability, unanswered calls, wrong numbers), and (2) voters
              typically need multiple exposures before a name or message sticks.
              For{' '}
              <span className="font-semibold text-foreground">
                {plan.winNumber.toLocaleString('en-US')} projected votes needed
                to win
              </span>
              ,{' '}
              <span className="font-semibold text-foreground">
                {plan.voterContactGoal.toLocaleString('en-US')} voter contacts
              </span>{' '}
              yields roughly 5 actual contacts per likely voter, the minimum for
              reliable name recognition in a nonpartisan race.
            </p>
          </Subsection>
          <Subsection title="Why a Volunteer-Hour Target?">
            <p>
              Volunteer hours, not budget, is a binding constraint on most
              campaigns. The{' '}
              <span className="font-semibold text-foreground">
                {plan.volunteerHourTarget.toLocaleString('en-US')} hour floor
              </span>{' '}
              is a conservative estimate of what it takes to personally cover
              your event schedule, run a door-knocking campaign, and monitor
              Election Day operations.
            </p>
          </Subsection>
        </Section>

        {/* 4. Voter Insights For Your District */}
        <Section
          id="plan-section-4"
          number={4}
          title="Voter Insights For Your District"
          transition="Voter insights sharpen as you fill in your platform and we layer in district-specific survey data. Update your issues in Campaign Manager and this section will re-frame around your priorities."
        >
          <VoterDemographicsStep
            ballotReadyPositionId={voterInsightsContext?.ballotReadyPositionId}
            city={voterInsightsContext?.city}
            state={voterInsightsContext?.state}
            office={voterInsightsContext?.office}
            showLocalNewsSources={false}
            headingsAsSubsections
          />
        </Section>

        {/* 5. Projected Minimum Resources Needed */}
        <Section
          id="plan-section-5"
          number={5}
          title="Projected Minimum Resources Needed"
          transition={`The $${plan.totalBudget.toLocaleString(
            'en-US',
          )} floor covers your minimum voter contact goal across digital and phone channels at a generic cost-per-vote benchmark. The real budget and how it gets spent depends on two things we don't yet know: what you can raise, and which voter you specifically should target. Go to your Campaign Manager to flesh out your budget and tailor it to achieve your goals.`}
        >
          <p className="text-sm text-muted-foreground">
            We project that you need at least{' '}
            <span className="font-semibold text-foreground">
              {plan.winNumber.toLocaleString('en-US')}
            </span>{' '}
            votes to win, with at least{' '}
            <span className="font-semibold text-foreground">
              {plan.weeksRemaining}
            </span>{' '}
            weeks left to campaign. The recommended total campaign budget is
            approximately{' '}
            <span className="font-semibold text-foreground">
              ${plan.totalBudget.toLocaleString('en-US')}
            </span>{' '}
            for voter outreach, compliance and fees, while{' '}
            <span className="font-semibold text-foreground">
              {plan.totalCampaignHours.toLocaleString('en-US')}
            </span>{' '}
            volunteer hours are needed for in-person campaigning, events, and
            volunteers.
          </p>
          <Subsection
            title={`Budget Breakdown (based on ${plan.weeksRemaining} weeks in campaign)`}
          >
            <PlanTable
              columns={['Category', 'Amount', 'Rationale']}
              rows={plan.budgetLineItems.map((b) => [
                <span key="c" className="text-foreground">
                  {b.category}
                </span>,
                <span key="a" className="font-semibold text-foreground">
                  {b.amount}
                </span>,
                <span key="r" className="text-muted-foreground">
                  {b.rationale}
                </span>,
              ])}
            />
          </Subsection>
          <Subsection title="How to Raise This">
            <p>
              <span className="font-semibold text-foreground">
                ${plan.totalBudget.toLocaleString('en-US')}
              </span>{' '}
              sounds like real money. For most candidates at this level, it
              comes from a surprisingly small number of people, typically 20 to
              40 donors giving $25 to $100 each. No extra cushion is needed on
              top of that target; the budget already builds in a reserve for
              unexpected costs.
            </p>
            <p>
              The right fundraising mix is candidate-specific, but every source
              compounds the others — an online donor becomes a house party host,
              a family loan gets paid back by small-dollar supporters you never
              expected. For a race like yours, the default starting mix looks
              like this:
            </p>
            <PlanTable
              columns={['Source', 'Share']}
              rows={plan.fundraisingMix.map((f) => [
                <span key="s" className="text-foreground">
                  {f.source}
                </span>,
                <span key="sh" className="font-semibold text-foreground">
                  {f.share}
                </span>,
              ])}
            />
          </Subsection>
          <Subsection
            title={`Time Breakdown (based on ${plan.weeksRemaining} weeks in campaign)`}
          >
            <PlanTable
              columns={['Category', 'Amount', 'Rationale']}
              rows={plan.timeBreakdown.map((t) => [
                <span key="c" className="text-foreground">
                  {t.category}
                </span>,
                <span key="a" className="font-semibold text-foreground">
                  {t.amount}
                </span>,
                <span key="r" className="text-muted-foreground">
                  {t.rationale}
                </span>,
              ])}
            />
          </Subsection>
        </Section>

        {/* 6. Campaign Timeline */}
        <Section
          id="plan-section-6"
          number={6}
          title="Campaign Timeline"
          transition="The key dates you need to know about your race have been established. What it doesn't yet reflect is your launch event, your fundraising rollout, and the issue moments you want to own. Share those with us on your Campaign Manager and we'll turn this into a working plan."
        >
          <p className="text-sm text-muted-foreground">
            Dates below are the hard gates the campaign must hit. Each is
            followed by an internal working deadline (one week earlier wherever
            possible) to preserve a buffer.
          </p>
          <PlanTable
            columns={['Date', 'Milestone', 'Notes']}
            rows={plan.timeline.map((t) => [
              <span key="d" className="font-semibold whitespace-nowrap">
                {t.date}
              </span>,
              <span key="m" className="text-foreground">
                {t.milestone}
              </span>,
              <span key="n" className="text-muted-foreground">
                {t.notes}
              </span>,
            ])}
          />
        </Section>

        {/* 7. Community Engagement & Earned Media */}
        <Section
          id="plan-section-7"
          number={7}
          title="Community Engagement & Earned Media"
          transition="These are your highest-value rooms and your best media targets. Once you tell us why you're running and what you stand for in Campaign Manager, we can turn this list into ready-to-use talking points for each event and a press pitch you can send this week."
        >
          <p className="text-sm text-muted-foreground">
            Earned media and in-person visibility are the highest-ROI channels
            in a race this size. A single mention in a local outlet or a strong
            showing at a civic association meeting can move more voters than any
            paid channel at this budget.
          </p>
          <Subsection title="Community Events">
            <PlanTable
              columns={['Event', 'Address', 'Date', 'Why It Matters']}
              rows={plan.civicEvents.map((e) => [
                <span key="e" className="text-foreground">
                  {e.event}
                </span>,
                <span key="a" className="text-muted-foreground">
                  {e.address}
                </span>,
                <span key="d" className="whitespace-nowrap text-foreground">
                  {e.date}
                </span>,
                <span key="w" className="text-muted-foreground">
                  {e.why}
                </span>,
              ])}
            />
          </Subsection>
          <Subsection title="Press & Media Outlets">
            <p>
              Target at least one earned-media placement per week between{' '}
              <span className="font-semibold text-foreground">
                {plan.contactWindowStart || '{12_weeks_before_election_date}'}
              </span>{' '}
              and{' '}
              <span className="font-semibold text-foreground">
                {plan.electionDate || '{election_date}'}
              </span>
              . We can help you prepare a single-page fact sheet and two short
              op-ed drafts that can be tailored quickly to each outlet&apos;s
              editorial voice.
            </p>
            <PlanTable
              columns={['Outlet', 'Type', 'Pitch Angle', 'Contact Info']}
              rows={plan.pressOutlets.map((o) => [
                <span key="o" className="text-foreground">
                  {o.outlet}
                </span>,
                <span key="t" className="text-muted-foreground">
                  {o.type}
                </span>,
                <span key="a" className="text-muted-foreground">
                  {o.angle}
                </span>,
                <span
                  key="c"
                  className="whitespace-pre-line text-muted-foreground"
                >
                  {o.contact}
                </span>,
              ])}
            />
          </Subsection>
        </Section>

        {/* 8. Voter Contact Plan */}
        <Section
          id="plan-section-8"
          number={8}
          title="Voter Contact Plan"
          transition="This plan puts you in front of every likely voter at the right moment. But repeated exposure only converts to votes if the message is specific and credible. Once you share your issues and your story in Campaign Manager, we'll help you build the actual message for each campaign so all you need to do is schedule the campaign."
        >
          <p className="text-sm text-muted-foreground">
            The contact cadence below is designed so that every likely voter
            receives at least 1 introductory voter contact, at least 1
            persuasion voter contact, at least 1 early vote reminder, and at
            least 1 Election Day push. Texts are the primary workhorse;
            robocalls layer on top to catch landline-only voters.
          </p>
          <PlanTable
            columns={['Date', 'Tactic', 'Purpose']}
            rows={plan.contactSchedule.map((s) => [
              <span key="d" className="whitespace-nowrap font-semibold">
                {s.date}
              </span>,
              <span key="t" className="font-semibold text-foreground">
                {s.tactic}
              </span>,
              <span key="p" className="text-muted-foreground">
                {s.purpose}
              </span>,
            ])}
          />
          <Subsection title="Expected Outcome">
            <p>
              Across{' '}
              <span className="font-semibold text-foreground">
                7 voter contact campaigns
              </span>
              , this plan produces over{' '}
              <span className="font-semibold text-foreground">
                {plan.voterContactGoal.toLocaleString('en-US')} voter contacts
              </span>{' '}
              against the group of{' '}
              <span className="font-semibold text-foreground">
                {plan.winNumber.toLocaleString('en-US')} voters
              </span>
              , more than the 5 contacts per likely voter. Expected realized
              contact (accounting for deliverability and answer rates) is{' '}
              <span className="font-semibold text-foreground">~60–70%</span> of
              voter contacts, which clears the threshold for reliable name
              recognition in a nonpartisan race.
            </p>
          </Subsection>
        </Section>

        {/* 9. Measurement & Accountability */}
        <Section
          id="plan-section-9"
          number={9}
          title="Measurement & Accountability"
          transition="The measurement system is live in Campaign Manager. What it's measuring right now is a default campaign. Once you personalize your plan with your goals, your capacity, and your timeline, the dashboard starts tracking the campaign you're actually running, and the gap between where you are and where you need to be becomes a lot easier to read."
        >
          <p className="text-sm text-foreground">
            Every week, log into your Campaign Manager to check your progress.
            We estimate the number of likely votes you are on track to receive
            based on the activity you complete. Our proprietary models predict
            the number of likely votes you get, based on the{' '}
            <span className="font-semibold">quality</span> and{' '}
            <span className="font-semibold">frequency</span> of{' '}
            <span className="font-semibold">voter contacts</span>.
          </p>
          <p className="text-sm text-foreground">
            This number will grow as you work through your voter contact plan.
            It will never reach 100% — that is by design. No campaign plan can
            guarantee an outcome, and there is always another action that you
            can take to increase your chances of winning. What this will do is
            show you clearly whether you are on pace, ahead, or behind, and give
            you time to adjust before it is too late.
          </p>
          <Subsection title="How to read your progress">
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              <li>
                If your likely votes are tracking toward your projected votes
                needed to win, stay the course.
              </li>
              <li>
                If you are falling behind, prioritize scheduling your next text
                or robocall campaign and look for additional outreach
                opportunities.
              </li>
              <li>
                Check in at least once a week — small gaps caught early are easy
                to close; the same gap caught in the final week is not.
              </li>
            </ul>
          </Subsection>
        </Section>

        {/* 10. Methodology & Data Sources */}
        <Section
          id="plan-section-10"
          number={10}
          title="Methodology & Data Sources"
          transition="This plan was prepared by GoodParty.org's automated campaign-intelligence system and is intended as a working starting point for the campaign. All estimates should be revisited weekly as new data arrives."
        >
          <p className="text-sm text-muted-foreground">
            This plan was produced by GoodParty.org using public voter data,
            historical election results, and our proprietary models. Every
            metric in this document is an estimate derived from the sources
            below. Where applicable, we include our best-estimate confidence
            interval so that the candidate and campaign manager can understand
            how firm each number is.
          </p>
          <Subsection title="Data Sources">
            <PlanTable
              columns={['Metric', 'Source', 'Last Updated']}
              rows={plan.dataSources.map((d) => [
                <span key="m" className="text-foreground">
                  {d.metric}
                </span>,
                <span key="s" className="text-muted-foreground">
                  {d.source}
                </span>,
                <span
                  key="u"
                  className="whitespace-nowrap text-muted-foreground"
                >
                  {d.lastUpdated}
                </span>,
              ])}
            />
          </Subsection>
          <Subsection title="Key Assumptions">
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {plan.keyAssumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Subsection>
          <Subsection title="Confidence & Standard Error">
            <PlanTable
              columns={[
                'Estimate',
                'Point Value',
                'Est. Range (95% CI)',
                'Notes',
              ]}
              rows={plan.confidenceEstimates.map((c) => [
                <span key="e" className="text-foreground">
                  {c.estimate}
                </span>,
                <span key="p" className="font-semibold whitespace-nowrap">
                  {c.pointValue}
                </span>,
                <span
                  key="r"
                  className="text-muted-foreground whitespace-nowrap"
                >
                  {c.range}
                </span>,
                <span key="n" className="text-muted-foreground">
                  {c.notes}
                </span>,
              ])}
            />
            <p className="text-sm text-muted-foreground">
              Standard-error ranges above reflect modeling uncertainty only.
              They do not account for late-breaking external events (weather,
              news cycles, last-minute challengers). The campaign should treat
              the point values as planning numbers and revisit them weekly as
              turnout signals harden.
            </p>
          </Subsection>
          <Subsection title="What This Plan Does Not Do">
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {plan.planDoesNotDo.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </Subsection>
        </Section>

        {/* 11. Glossary */}
        <Section id="plan-section-11" number={11} title="Glossary">
          <PlanTable
            columns={['Term', 'Definition']}
            rows={plan.glossary.map((g) => [
              <span key="t" className="font-semibold text-foreground">
                {g.term}
              </span>,
              <span key="d" className="text-muted-foreground">
                {g.definition}
              </span>,
            ])}
          />
        </Section>
      </div>
    </div>
  )
}

export default PlanSections
