'use client'

import PlanSectionNav, { type PlanSectionRef } from './PlanSectionNav'
import type { PlanData } from './planContent'

interface PlanSectionsProps {
  plan: PlanData
  onDownload?: () => void
  onShare?: () => void
  downloading?: boolean
  onStuckChange?: (stuck: boolean) => void
}

interface SectionProps {
  id: string
  number: number
  title: string
  children: React.ReactNode
}

const Section = ({
  id,
  number,
  title,
  children,
}: SectionProps): React.JSX.Element => (
  <section
    id={id}
    className="scroll-mt-24 border-t border-base-border pt-12 first-of-type:border-t-0 first-of-type:pt-0"
  >
    <header className="mb-2 space-y-4">
      <p className="text-xs font-semibold tracking-widest text-components-input-active uppercase">
        Section {number}
      </p>
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
        {title}
      </h2>
    </header>
    <div className="space-y-8 text-left">{children}</div>
  </section>
)

const PLAN_SECTIONS: PlanSectionRef[] = [
  { id: 'plan-section-1', label: '1. Executive Summary' },
  { id: 'plan-section-2', label: '2. Strategic Landscape' },
  { id: 'plan-section-3', label: '3. Electoral Goals & Key Metrics' },
  { id: 'plan-section-4', label: '4. Campaign Timeline' },
  { id: 'plan-section-5', label: '5. Recommended Budget' },
  { id: 'plan-section-6', label: '6. Community Engagement & Earned Media' },
  { id: 'plan-section-7', label: '7. Voter Contact Plan' },
  { id: 'plan-section-8', label: '8. Measurement & Accountability' },
  { id: 'plan-section-9', label: '9. Methodology & Data Sources' },
  { id: 'plan-section-10', label: '10. Glossary' },
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

const PlanSections = ({
  plan,
  onDownload,
  onShare,
  downloading,
  onStuckChange,
}: PlanSectionsProps): React.JSX.Element => (
  <div className="text-left">
    <PlanSectionNav
      sections={PLAN_SECTIONS}
      onDownload={onDownload}
      onShare={onShare}
      downloading={downloading}
      onStuckChange={onStuckChange}
    />

    <div className="mt-8 space-y-16">
      {/* 1. Executive Summary */}
      <Section id="plan-section-1" number={1} title="Executive Summary">
        <p className="text-sm text-muted-foreground">
          This is the whole plan in one view. If you read nothing else, read
          this.
        </p>

        <Subsection title="Your Race">
          <p>
            You are running for{' '}
            <span className="font-semibold text-foreground">{plan.race}</span>
            {plan.location ? ` in ${plan.location}` : ''}. The race is
            nonpartisan with {plan.opponentCount} opponents. Election Day is{' '}
            <span className="font-semibold text-foreground">
              {plan.electionDate}
            </span>
            . Because the electorate is small and no party cue appears on the
            ballot, the race is decided by name recognition and turnout, not
            ideological persuasion.
          </p>
        </Subsection>

        <Subsection title="Your Win Condition">
          <p>
            We project voter turnout of{' '}
            <span className="font-semibold text-foreground">
              {plan.projectedTurnout.toLocaleString('en-US')} (±10%)
            </span>
            , which puts your threshold for a guaranteed win at{' '}
            <span className="font-semibold text-foreground">
              {plan.winNumber.toLocaleString('en-US')} votes
            </span>
            , a conservative 50% + 1 target. Hitting that target requires{' '}
            <span className="font-semibold text-foreground">
              {plan.voterContactGoal.toLocaleString('en-US')} quality voter
              touches
            </span>{' '}
            across the cycle, delivered through matched phone data plus
            in-person visibility and earned media.
          </p>
        </Subsection>

        <Subsection title="Strategy at a Glance">
          <DefinitionList items={plan.strategyBullets} />
        </Subsection>

        <Subsection title="Key Numbers">
          <KeyValueTable
            rows={plan.keyNumbers.map((n) => ({
              label: n.metric,
              value: n.target,
            }))}
          />
        </Subsection>

        <Subsection title="Timeline Highlights">
          <ul className="space-y-2 text-sm">
            {plan.timelineHighlights.map((row) => (
              <li key={row.date}>
                <span className="font-semibold text-foreground">
                  {row.date}.
                </span>{' '}
                <span className="text-muted-foreground">{row.description}</span>
              </li>
            ))}
          </ul>
        </Subsection>

        <Subsection title="What You Must Commit Personally">
          <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
            {plan.candidateCommitments.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Subsection>

        <Subsection title="Biggest Risks">
          <DefinitionList items={plan.biggestRisks} />
        </Subsection>
      </Section>

      {/* 2. Strategic Landscape */}
      <Section id="plan-section-2" number={2} title="Strategic Landscape">
        <p className="text-sm text-muted-foreground">
          Your district is a small, often nonpartisan electorate where name
          recognition and turnout, not ideological persuasion, decide most
          races. The following opportunities and challenges are framed against
          that reality.
        </p>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Subsection title="Opportunities">
            <DefinitionList items={plan.opportunities} />
          </Subsection>
          <Subsection title="Challenges">
            <DefinitionList items={plan.challenges} />
          </Subsection>
        </div>
        <Subsection title="Competitive Read">
          <p>
            This plan is deliberately opponent-agnostic. You should produce a
            brief opponent memo covering each opponent&apos;s name-recognition
            baseline, their top one or two public positions, and any obvious
            coalitions they are courting. Until that memo exists, the plan
            assumes a neutral split and optimizes for your own turnout.
          </p>
        </Subsection>
      </Section>

      {/* 3. Electoral Goals & Key Metrics */}
      <Section
        id="plan-section-3"
        number={3}
        title="Electoral Goals & Key Metrics"
      >
        <p className="text-sm text-muted-foreground">
          These are the numbers you will manage against. Each metric includes
          its data source and the sensitivity we apply when re-forecasting
          weekly.
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
        <Subsection title="Why 5x the Win Number?">
          <p>
            The industry convention to plan for roughly five voter-contact
            attempts per vote needed comes from two realities. First, not every
            attempt reaches the voter (text deliverability, unanswered calls,
            wrong numbers). Second, voters typically need multiple exposures
            before a name or message sticks. For a{' '}
            {plan.winNumber.toLocaleString('en-US')}-vote target,{' '}
            {plan.voterContactGoal.toLocaleString('en-US')} attempts yields
            roughly two to three actual, memorable contacts per likely voter,
            the minimum for reliable name recognition.
          </p>
        </Subsection>
        <Subsection title="Why a Volunteer-Hour Target?">
          <p>
            Volunteer capacity, not money, is the binding constraint on most
            small-precinct campaigns. The {plan.volunteerHourTarget}-hour floor
            is a conservative estimate of what it will take for you to cover the
            civic-event schedule, run a small door-knocking program, and monitor
            Election Day operations.
          </p>
        </Subsection>
      </Section>

      {/* 4. Campaign Timeline */}
      <Section id="plan-section-4" number={4} title="Campaign Timeline">
        <p className="text-sm text-muted-foreground">
          Dates below are the hard gates you must hit. Each is followed by an
          internal working deadline (one week earlier wherever possible) to
          preserve a buffer.
        </p>
        <PlanTable
          columns={['Date', 'Milestone', 'Owner / Notes']}
          rows={plan.timeline.map((t) => [
            <span key="d" className="font-semibold whitespace-nowrap">
              {t.date}
            </span>,
            <span key="m" className="text-foreground">
              {t.milestone}
            </span>,
            <span key="o" className="text-muted-foreground">
              {t.owner}
            </span>,
          ])}
        />
      </Section>

      {/* 5. Recommended Budget */}
      <Section id="plan-section-5" number={5} title="Recommended Budget">
        <p className="text-sm text-muted-foreground">
          The recommended total campaign budget is approximately{' '}
          <span className="font-semibold text-foreground">
            ${plan.totalBudget.toLocaleString('en-US')}
          </span>
          , calculated from a cost-per-vote benchmark of roughly $3 to $4 per
          targeted voter across all digital and phone channels, rounded for
          planning clarity. Every dollar should be directed toward high-impact
          outreach that drives name recognition and turnout.
        </p>
        <Subsection title="Line-Item Breakdown">
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
        <Subsection title="What This Budget Does Not Cover">
          <DefinitionList items={plan.budgetNotCovered} />
        </Subsection>
      </Section>

      {/* 6. Community Engagement & Earned Media */}
      <Section
        id="plan-section-6"
        number={6}
        title="Community Engagement & Earned Media"
      >
        <p className="text-sm text-muted-foreground">
          Earned media and in-person visibility are the highest-ROI channels in
          a race this size. A single mention in a local outlet or a strong
          showing at a civic association meeting can move more voters than any
          paid channel at this budget.
        </p>
        <Subsection title="Civic Events">
          <PlanTable
            columns={['Event', 'Date', 'Why It Matters']}
            rows={plan.civicEvents.map((e) => [
              <span key="e" className="text-foreground">
                {e.event}
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
        <Subsection title="Press / Media Outlets">
          <PlanTable
            columns={['Outlet', 'Type', 'Pitch Angle']}
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
            ])}
          />
          <p className="text-sm text-foreground">
            Aim for at least one earned-media placement per week during the
            final month. Prepare a single-page fact sheet and two short op-ed
            drafts (under 200 words) you can tailor quickly to each
            outlet&apos;s editorial voice.
          </p>
        </Subsection>
      </Section>

      {/* 7. Voter Contact Plan */}
      <Section id="plan-section-7" number={7} title="Voter Contact Plan">
        <p className="text-sm text-muted-foreground">
          The contact cadence below is designed so every likely voter receives
          at least one introductory touch before mail ballots arrive, at least
          one deadline reminder, and at least one Election-Day push.
          Peer-to-peer texts are the primary workhorse. Robocalls layer on top
          to catch landline-only voters.
        </p>
        <PlanTable
          columns={['Date', 'Tactic', 'Audience', 'Purpose', 'Format']}
          rows={plan.contactSchedule.map((s) => [
            <span key="d" className="whitespace-nowrap font-semibold">
              {s.date}
            </span>,
            <span key="t" className="font-semibold text-foreground">
              {s.tactic}
            </span>,
            <span key="a" className="text-muted-foreground">
              {s.audience}
            </span>,
            <span key="p" className="text-muted-foreground">
              {s.purpose}
            </span>,
            <span key="f" className="text-muted-foreground">
              {s.format}
            </span>,
          ])}
        />
        <Subsection title="Expected Yield">
          <p>
            Across these sends, the plan produces approximately{' '}
            <span className="font-semibold text-foreground">
              {plan.voterContactGoal.toLocaleString('en-US')} quality touches
            </span>{' '}
            against your voter universe, an average of roughly{' '}
            <span className="font-semibold text-foreground">
              {plan.averageTouchesPerVoter} contacts per likely voter
            </span>
            . Expected realized contact (accounting for deliverability and
            answer rates) is 60 to 70 percent of attempts, which clears the
            threshold for reliable name recognition.
          </p>
        </Subsection>
        <Subsection title="Message Discipline">
          <p>
            Every send should carry the same three elements: your name in the
            first line, one concrete local issue (the same issue every time),
            and a single clear ask (register, request a ballot, vote on Election
            Day). Variation across sends dilutes recognition. Consistency is the
            point.
          </p>
        </Subsection>
      </Section>

      {/* 8. Measurement & Accountability */}
      <Section
        id="plan-section-8"
        number={8}
        title="Measurement & Accountability"
      >
        <p className="text-sm text-muted-foreground">
          Your campaign manager should review the KPI dashboard every Monday and
          report variances against target the same day. The goal is not to hit
          every number exactly, but to catch trends early enough to reallocate
          effort.
        </p>
        <PlanTable
          columns={['KPI', 'Target', 'Review Cadence']}
          rows={plan.kpis.map((k) => [
            <span key="k" className="text-foreground">
              {k.kpi}
            </span>,
            <span key="t" className="font-semibold text-foreground">
              {k.target}
            </span>,
            <span key="c" className="text-muted-foreground">
              {k.cadence}
            </span>,
          ])}
        />
      </Section>

      {/* 9. Methodology & Data Sources */}
      <Section
        id="plan-section-9"
        number={9}
        title="Methodology & Data Sources"
      >
        <p className="text-sm text-muted-foreground">
          This plan was produced by GoodParty.org&apos;s automated
          campaign-intelligence pipeline. Every metric in this document is an
          estimate derived from the sources below. Where applicable, we include
          a best-estimate confidence interval so you can understand how firm
          each number is.
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
              <span key="u" className="whitespace-nowrap text-muted-foreground">
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
            columns={['Estimate', 'Point Value', 'Estimated Range', 'Notes']}
            rows={plan.confidenceEstimates.map((c) => [
              <span key="e" className="text-foreground">
                {c.estimate}
              </span>,
              <span key="p" className="font-semibold whitespace-nowrap">
                {c.pointValue}
              </span>,
              <span key="r" className="text-muted-foreground whitespace-nowrap">
                {c.range}
              </span>,
              <span key="n" className="text-muted-foreground">
                {c.notes}
              </span>,
            ])}
          />
          <p className="text-sm text-muted-foreground">
            Standard-error ranges reflect modeling uncertainty only. They do not
            account for late-breaking external events (weather, news cycles,
            last-minute challengers). Treat the point values as planning numbers
            and revisit weekly as turnout signals harden.
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

      {/* 10. Glossary */}
      <Section id="plan-section-10" number={10} title="Glossary">
        <dl className="divide-y divide-base-border rounded-xl border border-base-border">
          {plan.glossary.map((g) => (
            <div
              key={g.term}
              className="grid grid-cols-1 gap-2 px-4 py-4 text-sm md:grid-cols-[200px_1fr] md:gap-6"
            >
              <dt className="font-semibold text-foreground">{g.term}</dt>
              <dd className="text-muted-foreground">{g.definition}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  </div>
)

export default PlanSections
