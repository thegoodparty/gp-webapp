/* eslint-disable jsx-a11y/alt-text */
import type { ReactNode } from 'react'
import {
  Document,
  Font,
  Link,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text as PdfText,
  View,
} from '@react-pdf/renderer'
import type { Style } from '@react-pdf/types'
import type { PlanData } from './planContent'

// fontkit (used by @react-pdf/renderer) applies OpenType ligature substitution
// by default. With Open Sans this can produce dropped characters ("filed" →
// "fled"). Inserting a Zero-Width Non-Joiner between f and a following
// i/l/f/t/b/h/j/k tells the layout engine to skip the ligature lookup, so each
// letter renders as its own glyph. ZWNJ has no width.
const ZWNJ = '‌'
const defeatLigatures = (s: string): string =>
  s.replace(/(f)(?=[iflbhjkt])/gi, `$1${ZWNJ}`)

const processChildren = (children: ReactNode): ReactNode => {
  if (typeof children === 'string') return defeatLigatures(children)
  if (Array.isArray(children)) return children.map(processChildren)
  return children
}

interface TextProps {
  children?: ReactNode
  style?: Style | Style[]
  fixed?: boolean
  break?: boolean
  wrap?: boolean
  render?: (props: {
    pageNumber: number
    totalPages: number
  }) => React.ReactNode
}
const Text = ({ children, ...rest }: TextProps): React.JSX.Element => (
  <PdfText {...rest}>{processChildren(children)}</PdfText>
)

// Official Open Sans TTFs from googlefonts/opensans repo via jsdelivr.
// Full charset, ligature glyphs included.
Font.register({
  family: 'Open Sans',
  fonts: [
    {
      src: 'https://cdn.jsdelivr.net/gh/googlefonts/opensans@main/fonts/ttf/OpenSans-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/googlefonts/opensans@main/fonts/ttf/OpenSans-SemiBold.ttf',
      fontWeight: 'semibold',
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/googlefonts/opensans@main/fonts/ttf/OpenSans-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: 'https://cdn.jsdelivr.net/gh/googlefonts/opensans@main/fonts/ttf/OpenSans-Italic.ttf',
      fontStyle: 'italic',
    },
  ],
})

const COLORS = {
  text: '#0a0a0a',
  muted: '#737373',
  brand: '#2563eb',
  brandRed: '#BF0020',
  brandStar: '#0027DC',
  divider: '#e5e7eb',
  tableHead: '#f5f5f5',
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 72,
    paddingBottom: 72,
    paddingHorizontal: 56,
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.5,
  },

  // Cover
  coverPage: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.5,
  },
  coverFrame: {
    flex: 1,
    margin: 28,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 12,
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 48,
    alignItems: 'center',
  },
  coverHeader: { alignItems: 'center', marginBottom: 120 },
  coverHeartWrapper: { marginBottom: 12 },
  wordmark: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 1.2,
    marginBottom: 4,
  },
  wordmarkTagline: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: COLORS.muted,
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 1.4,
  },
  coverTitleBlock: { alignItems: 'center' },
  coverEyebrow: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: 20,
  },
  coverCandidate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 1.3,
    marginBottom: 6,
  },
  coverLocation: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 1.3,
    marginBottom: 6,
  },
  coverElection: {
    fontSize: 10,
    color: COLORS.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 1.3,
  },
  coverLinkBlock: { marginTop: 'auto', alignItems: 'center' },
  coverLinkEyebrow: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: COLORS.muted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  coverLink: { fontSize: 10, color: COLORS.brand, textDecoration: 'underline' },
  coverFooterText: {
    fontSize: 8,
    color: COLORS.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 32,
  },

  // Page header
  pageHeader: {
    position: 'absolute',
    top: 28,
    left: 56,
    right: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  pageHeaderBrand: { flexDirection: 'row', alignItems: 'center' },
  pageHeaderHeart: { marginRight: 6 },
  pageHeaderBrandText: { fontSize: 9, fontWeight: 'bold', color: COLORS.text },
  pageHeaderRace: { fontSize: 8, color: COLORS.muted, maxWidth: 360 },

  // Section
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  para: {
    fontSize: 10,
    lineHeight: 1.55,
    color: COLORS.text,
    marginBottom: 8,
  },
  paraMuted: {
    fontSize: 10,
    lineHeight: 1.55,
    color: COLORS.muted,
    marginBottom: 8,
    fontStyle: 'italic',
  },

  // Bullet + def list
  bullet: { flexDirection: 'row', marginBottom: 4 },
  bulletDot: { width: 10, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.5 },
  defItem: { marginBottom: 6 },
  defText: { fontSize: 10, lineHeight: 1.5 },
  defTerm: { fontWeight: 'bold' },

  // Table
  table: {
    marginTop: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: COLORS.tableHead,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  tableHeadCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.text,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  tableRowLast: { flexDirection: 'row' },
  tableCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 9,
    color: COLORS.text,
    lineHeight: 1.4,
  },

  // KV table
  kvTable: {
    borderWidth: 1,
    borderColor: COLORS.divider,
    borderRadius: 6,
    overflow: 'hidden',
    marginVertical: 4,
  },
  kvRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  kvLabel: { flex: 1, fontSize: 10, color: COLORS.muted },
  kvValue: { fontSize: 10, fontWeight: 'bold', textAlign: 'right' },

  // TOC
  tocTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 28 },
  tocRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 10 },
  tocLabel: { fontSize: 12, lineHeight: 1.2 },
  tocDots: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomStyle: 'dotted',
    borderBottomColor: COLORS.muted,
    marginHorizontal: 6,
    marginBottom: 3,
  },
  tocPage: { fontSize: 12, lineHeight: 1.2, minWidth: 24, textAlign: 'right' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 56,
    right: 56,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    paddingTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  footerPrepared: { flexDirection: 'row', alignItems: 'baseline' },
  footerText: { fontSize: 8, color: COLORS.muted },
  footerBold: { fontSize: 8, color: COLORS.text, fontWeight: 'bold' },

  // Glossary
  glossaryRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  glossaryTerm: { width: 150, fontSize: 10, fontWeight: 'bold' },
  glossaryDef: { flex: 1, fontSize: 10, color: COLORS.muted, lineHeight: 1.5 },
})

interface HeartLogoProps {
  size?: number
}

const HeartLogo = ({ size = 24 }: HeartLogoProps): React.JSX.Element => {
  const width = size
  const height = (size / 21) * 17
  return (
    <Svg width={width} height={height} viewBox="0 0 21 17">
      <Path
        d="M10.5 16.0943C14.7127 14.0566 17.5108 11.7713 18.9364 9.42378C20.1435 7.43596 20.2938 5.49775 19.5359 3.90325C18.8477 2.45547 17.4495 1.42171 15.8389 1.15535C14.1199 0.871043 12.3704 1.47864 10.9834 2.98335L10.5 3.50781L10.0166 2.98335C8.6296 1.47864 6.88015 0.871043 5.16108 1.15535C3.55052 1.42171 2.15231 2.45547 1.4641 3.90325C0.706157 5.49775 0.85648 7.43596 2.06363 9.42378C3.48922 11.7713 6.28734 14.0566 10.5 16.0943Z"
        fill="white"
        stroke={COLORS.brandRed}
        strokeWidth={1.55798}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.0712 10.3672L8.92515 10.9561C8.80802 11.0163 8.66314 10.9723 8.60153 10.8579C8.577 10.8123 8.56853 10.7601 8.57744 10.7094L8.79643 9.46149C8.84767 9.16949 8.7486 8.87154 8.53149 8.66471L7.60382 7.78094C7.50908 7.69068 7.50717 7.54246 7.59956 7.4499C7.63633 7.41305 7.68451 7.38907 7.73664 7.38167L9.01827 7.19966C9.31848 7.15702 9.57798 6.97278 9.7122 6.70699L10.2853 5.57199C10.3439 5.45604 10.4876 5.40841 10.6062 5.46562C10.6535 5.48841 10.6918 5.52579 10.7151 5.57199L11.2883 6.70699C11.4225 6.97278 11.682 7.15702 11.9822 7.19966L13.2638 7.38167C13.3948 7.40027 13.4855 7.51906 13.4665 7.64701C13.4589 7.69794 13.4343 7.74501 13.3966 7.78094L12.469 8.66471C12.2519 8.87154 12.1528 9.16949 12.204 9.46149L12.423 10.7094C12.4454 10.8368 12.3578 10.9578 12.2273 10.9797C12.1754 10.9884 12.122 10.9801 12.0753 10.9561L10.9292 10.3672C10.6607 10.2292 10.3398 10.2292 10.0712 10.3672Z"
        fill={COLORS.brandStar}
      />
    </Svg>
  )
}

// Resolve the city-only string used in the cover + page headers. Prefer the
// explicitly-passed prop; fall back to splitting the "City, State" location.
const resolveCity = (plan: PlanData, city?: string): string => {
  if (city && city.trim()) return city.trim()
  const first = plan.location.split(',')[0]?.trim()
  return first ?? ''
}

const buildHeaderRaceLine = (plan: PlanData, city?: string): string => {
  const left = plan.candidateName
    ? `${plan.candidateName} for ${plan.race}`
    : plan.race
  const right = resolveCity(plan, city)
  return [left, right].filter(Boolean).join(' · ')
}

interface PageHeaderProps {
  plan: PlanData
  city?: string
}

const PageHeader = ({ plan, city }: PageHeaderProps): React.JSX.Element => (
  <View style={styles.pageHeader} fixed>
    <View style={styles.pageHeaderBrand}>
      <View style={styles.pageHeaderHeart}>
        <HeartLogo size={14} />
      </View>
      <Text style={styles.pageHeaderBrandText}>GoodParty.org</Text>
    </View>
    <Text style={styles.pageHeaderRace}>{buildHeaderRaceLine(plan, city)}</Text>
  </View>
)

const PageFooter = (): React.JSX.Element => (
  <View style={styles.footer} fixed>
    <View style={styles.footerRow}>
      <View style={styles.footerPrepared}>
        <Text style={styles.footerText}>Prepared by </Text>
        <Text style={styles.footerBold}>GoodParty.org</Text>
        <Text style={styles.footerText}>
          {' · Empowering people to run, win, and serve'}
        </Text>
      </View>
      <PdfText
        style={styles.footerText}
        render={({ pageNumber, totalPages }) => (
          <>
            {'Page '}
            <PdfText style={styles.footerBold}>{pageNumber}</PdfText>
            {' of '}
            <PdfText style={styles.footerBold}>{totalPages}</PdfText>
          </>
        )}
      />
    </View>
  </View>
)

interface SectionHeaderProps {
  title: string
}

const SectionHeader = ({ title }: SectionHeaderProps): React.JSX.Element => (
  <Text style={styles.sectionTitle}>{title}</Text>
)

interface DefinitionListProps {
  items: { title: string; body: string }[]
}

const DefinitionList = ({ items }: DefinitionListProps): React.JSX.Element => (
  <View>
    {items.map((item) => (
      <View key={item.title} style={styles.defItem}>
        <Text style={styles.defText}>
          <Text style={styles.defTerm}>{item.title}</Text>{' '}
          <Text style={{ color: COLORS.muted }}>{item.body}</Text>
        </Text>
      </View>
    ))}
  </View>
)

interface BulletListProps {
  items: string[]
}

const BulletList = ({ items }: BulletListProps): React.JSX.Element => (
  <View>
    {items.map((item) => (
      <View key={item} style={styles.bullet} wrap={false}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
)

interface KvTableProps {
  rows: { label: string; value: string }[]
}

const KvTable = ({ rows }: KvTableProps): React.JSX.Element => (
  <View style={styles.kvTable}>
    {rows.map((row, idx) => (
      <View
        key={row.label}
        style={[
          styles.kvRow,
          idx === rows.length - 1 ? { borderBottomWidth: 0 } : {},
        ]}
      >
        <Text style={styles.kvLabel}>{row.label}</Text>
        <Text style={styles.kvValue}>{row.value}</Text>
      </View>
    ))}
  </View>
)

interface TableProps {
  columns: { label: string; flex?: number; bold?: boolean }[]
  rows: string[][]
}

const Table = ({ columns, rows }: TableProps): React.JSX.Element => (
  <View style={styles.table}>
    <View style={styles.tableHead}>
      {columns.map((col) => (
        <Text
          key={col.label}
          style={[styles.tableHeadCell, col.flex ? { flex: col.flex } : {}]}
        >
          {col.label}
        </Text>
      ))}
    </View>
    {rows.map((row, rIdx) => {
      const isLast = rIdx === rows.length - 1
      return (
        <View
          key={rIdx}
          style={isLast ? styles.tableRowLast : styles.tableRow}
          wrap={false}
        >
          {row.map((cell, cIdx) => {
            const col = columns[cIdx]!
            return (
              <Text
                key={cIdx}
                style={[
                  styles.tableCell,
                  col.flex ? { flex: col.flex } : {},
                  col.bold ? { fontWeight: 'bold' } : {},
                ]}
              >
                {cell}
              </Text>
            )
          })}
        </View>
      )
    })}
  </View>
)

const TOC_ENTRIES: { label: string; page: number }[] = [
  { label: 'Executive Summary', page: 3 },
  { label: '1. Strategic Landscape', page: 5 },
  { label: '2. Electoral Goals & Key Metrics', page: 6 },
  { label: '3. Voter Insights For Your District', page: 8 },
  { label: '4. Campaign Timeline', page: 9 },
  { label: '5. Projected Minimum Resources Needed', page: 10 },
  { label: '6. Community Engagement & Earned Media', page: 11 },
  { label: '7. Voter Contact Plan', page: 12 },
  { label: '8. Measurement & Accountability', page: 13 },
  { label: '9. Methodology & Data Sources', page: 14 },
  { label: '10. Glossary', page: 15 },
]

const TableOfContents = (): React.JSX.Element => (
  <View>
    <Text style={styles.tocTitle}>Table of Contents</Text>
    {TOC_ENTRIES.map((entry) => (
      <View key={entry.label} style={styles.tocRow}>
        <Text style={styles.tocLabel}>{entry.label}</Text>
        <View style={styles.tocDots} />
        <Text style={styles.tocPage}>{entry.page}</Text>
      </View>
    ))}
  </View>
)

interface CampaignPlanPdfProps {
  plan: PlanData
  city?: string
  liveUrl?: string
}

export const CampaignPlanPdf = ({
  plan,
  city,
  liveUrl = 'https://goodparty.org',
}: CampaignPlanPdfProps): React.JSX.Element => (
  <Document title="Campaign Plan" author="GoodParty.org">
    {/* Cover */}
    <Page size="LETTER" style={styles.coverPage}>
      <View style={styles.coverFrame}>
        <View style={styles.coverHeader}>
          <View style={styles.coverHeartWrapper}>
            <HeartLogo size={48} />
          </View>
          <Text style={styles.wordmark}>GoodParty.org</Text>
          <Text style={styles.wordmarkTagline}>
            Empowering people to run, win, and serve
          </Text>
        </View>

        <View style={styles.coverTitleBlock}>
          <Text style={styles.coverEyebrow}>Campaign Plan</Text>
          {plan.candidateName ? (
            <Text style={styles.coverCandidate}>
              {plan.candidateName} for {plan.race}
            </Text>
          ) : (
            <Text style={styles.coverCandidate}>{plan.race}</Text>
          )}
          {plan.electionDate ? (
            <Text style={styles.coverElection}>
              Election Day: {plan.electionDate}
            </Text>
          ) : null}
        </View>

        <View style={styles.coverLinkBlock}>
          <Text style={styles.coverLinkEyebrow}>
            View your live campaign plan
          </Text>
          <Link src={liveUrl} style={styles.coverLink}>
            {liveUrl.replace(/^https?:\/\//, '')}
          </Link>
          <Text style={styles.coverFooterText}>
            Plan prepared by GoodParty.org&apos;s Win Campaign Intelligence
            System using public voter data and historical election results.
          </Text>
        </View>
      </View>
    </Page>

    {/* Table of Contents */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <TableOfContents />
      <PageFooter />
    </Page>

    {/* Executive Summary */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Executive Summary" />
      <Text style={styles.paraMuted}>
        This page is the whole plan in one view. If you read nothing else, read
        this.
      </Text>

      <Text style={styles.subTitle}>Your Race</Text>
      <Text style={styles.para}>
        You are running for {plan.race}
        {plan.hasDistrict ? ` representing ${plan.districtName}` : ''}. As of{' '}
        {plan.planGenerationDate}, the race has {plan.opponentCount}{' '}
        {plan.opponentCount === 1 ? 'opponent' : 'opponents'}
        {plan.incumbent
          ? `, including the incumbent ${plan.incumbent.name}`
          : ''}
        . Election Day is {plan.electionDate}.
      </Text>

      <Text style={styles.subTitle}>Your Win Condition</Text>
      <Text style={styles.para}>
        We project voter turnout of{' '}
        {plan.projectedTurnout.toLocaleString('en-US')} (±10%), which puts your
        threshold for a guaranteed win at{' '}
        {plan.winNumber.toLocaleString('en-US')} votes — a conservative 50% + 1
        target. Hitting that target requires{' '}
        {plan.voterContactGoal.toLocaleString('en-US')} quality voter touches
        across the cycle.
      </Text>

      <Text style={styles.subTitle}>Plan at a Glance</Text>
      <DefinitionList items={plan.planAtAGlance} />

      <Text style={styles.subTitle}>Key Campaign Targets</Text>
      <KvTable
        rows={plan.keyCampaignTargets.map((t) => ({
          label: t.metric,
          value: t.target,
        }))}
      />

      <PageFooter />
    </Page>

    {/* 1. Strategic Landscape */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Strategic Landscape" />
      <Text style={styles.para}>
        Your district is a small, often nonpartisan electorate where name
        recognition and turnout — not ideological persuasion — decide most
        races.
      </Text>

      <Text style={styles.subTitle}>Opportunities</Text>
      <DefinitionList items={plan.opportunities} />

      <Text style={styles.subTitle}>Challenges</Text>
      <DefinitionList items={plan.challenges} />
      <PageFooter />
    </Page>

    {/* 2. Electoral Goals & Key Metrics */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Electoral Goals & Key Metrics" />
      <Text style={styles.para}>
        The numbers below are projected from historical voter data and
        proprietary models for {plan.districtName || plan.race}.
      </Text>
      <Table
        columns={[
          { label: 'Metric', flex: 2 },
          { label: 'Target', flex: 1, bold: true },
          { label: 'Source / Formula', flex: 3 },
        ]}
        rows={plan.metrics.map((m) => [m.metric, m.target, m.source])}
      />
      <PageFooter />
    </Page>

    {/* 3. Voter Insights For Your District */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Voter Insights For Your District" />
      <Text style={styles.para}>
        We use survey and voter data along with your district demographics to
        project the likely top issues in your race.
      </Text>
      <DefinitionList
        items={plan.voterInsightsIssues.map((i) => ({
          title: i.title,
          body: i.description,
        }))}
      />
      <PageFooter />
    </Page>

    {/* 4. Campaign Timeline */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Campaign Timeline" />
      <Text style={styles.para}>
        Dates below are the hard gates you must hit.
      </Text>
      <Table
        columns={[
          { label: 'Date', flex: 1.2, bold: true },
          { label: 'Milestone', flex: 2.5 },
          { label: 'Notes', flex: 2 },
        ]}
        rows={plan.timeline.map((t) => [t.date, t.milestone, t.notes])}
      />
      <PageFooter />
    </Page>

    {/* 5. Projected Minimum Resources Needed */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Projected Minimum Resources Needed" />
      <Text style={styles.para}>
        Total recommended budget: ${plan.totalBudget.toLocaleString('en-US')}.
        Total time commitment: {plan.totalCampaignHours.toLocaleString('en-US')}{' '}
        hours across the campaign.
      </Text>

      <Text style={styles.subTitle}>Budget</Text>
      <Table
        columns={[
          { label: 'Category', flex: 2 },
          { label: 'Amount', flex: 1, bold: true },
          { label: 'Rationale', flex: 3 },
        ]}
        rows={plan.budgetLineItems.map((b) => [
          b.category,
          b.amount,
          b.rationale,
        ])}
      />

      <Text style={styles.subTitle}>Time</Text>
      <Table
        columns={[
          { label: 'Category', flex: 2 },
          { label: 'Amount', flex: 1, bold: true },
          { label: 'Rationale', flex: 3 },
        ]}
        rows={plan.timeBreakdown.map((b) => [
          b.category,
          b.amount,
          b.rationale,
        ])}
      />
      <PageFooter />
    </Page>

    {/* 6. Community Engagement & Earned Media */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Community Engagement & Earned Media" />
      <Text style={styles.subTitle}>Civic Events</Text>
      <Table
        columns={[
          { label: 'Event', flex: 2 },
          { label: 'Date', flex: 1 },
          { label: 'Why It Matters', flex: 3 },
        ]}
        rows={plan.civicEvents.map((e) => [e.event, e.date, e.why])}
      />

      <Text style={styles.subTitle}>Press & Media</Text>
      <Table
        columns={[
          { label: 'Outlet', flex: 2 },
          { label: 'Type', flex: 1.5 },
          { label: 'Pitch Angle', flex: 3 },
        ]}
        rows={plan.pressOutlets.map((o) => [o.outlet, o.type, o.angle])}
      />
      <PageFooter />
    </Page>

    {/* 7. Voter Contact Plan */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Voter Contact Plan" />
      <Text style={styles.para}>
        The contact cadence below is designed so every likely voter receives at
        least one introductory touch before mail ballots arrive.
      </Text>
      <Table
        columns={[
          { label: 'Date', flex: 1.2, bold: true },
          { label: 'Tactic', flex: 1.5 },
          { label: 'Purpose', flex: 3 },
        ]}
        rows={plan.contactSchedule.map((s) => [s.date, s.tactic, s.purpose])}
      />
      <PageFooter />
    </Page>

    {/* 8. Measurement & Accountability */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Measurement & Accountability" />
      <Text style={styles.para}>
        Review the KPIs every Monday. The goal isn&apos;t to hit every number
        exactly — it&apos;s to catch trends early enough to reallocate effort.
      </Text>
      <Text style={styles.subTitle}>Key Assumptions</Text>
      <BulletList items={plan.keyAssumptions} />
      <PageFooter />
    </Page>

    {/* 9. Methodology & Data Sources */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Methodology & Data Sources" />
      <Text style={styles.para}>
        Every metric in this document is an estimate derived from the sources
        below.
      </Text>
      <Text style={styles.subTitle}>Data Sources</Text>
      <Table
        columns={[
          { label: 'Metric', flex: 2 },
          { label: 'Source', flex: 3 },
          { label: 'Last Updated', flex: 1.5 },
        ]}
        rows={plan.dataSources.map((d) => [d.metric, d.source, d.lastUpdated])}
      />
      <Text style={styles.subTitle}>What This Plan Does Not Do</Text>
      <BulletList items={plan.planDoesNotDo} />
      <PageFooter />
    </Page>

    {/* 10. Glossary */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} city={city} />
      <SectionHeader title="Glossary" />
      <View>
        {plan.glossary.map((g) => (
          <View key={g.term} style={styles.glossaryRow} wrap={false}>
            <Text style={styles.glossaryTerm}>{g.term}</Text>
            <Text style={styles.glossaryDef}>{g.definition}</Text>
          </View>
        ))}
      </View>
      <PageFooter />
    </Page>
  </Document>
)
