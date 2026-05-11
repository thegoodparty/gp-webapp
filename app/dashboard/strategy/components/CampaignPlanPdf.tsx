/* eslint-disable jsx-a11y/alt-text */
import type { ReactNode } from 'react'
import {
  Document,
  Font,
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
// by default. With Open Sans this produces visible character drops in the PDF
// ("filed" → "fled", "first" → "frst"). Inserting a Zero-Width Non-Joiner
// between f and a following i/l/f/t/b/h/j/k tells the layout engine to skip
// the ligature lookup, so each letter renders as its own glyph. ZWNJ has no
// width and no visible representation.
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

// Open Sans (matches the app's typography). TTF files from the official
// googlefonts/opensans repo via jsdelivr. The full-charset TTFs include the
// ligature glyphs (U+FB01–FB04) that fontkit's GSUB substitution needs.
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
  divider: '#e5e7eb',
  tableHead: '#f5f5f5',
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 56,
    fontFamily: 'Open Sans',
    fontSize: 10,
    color: COLORS.text,
    lineHeight: 1.5,
  },
  coverWrapper: {
    flex: 1,
    paddingTop: 160,
  },
  coverHeader: { alignItems: 'center' },
  wordmark: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 1.2,
  },
  wordmarkTagline: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.muted,
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  coverHeaderInner: { alignItems: 'center', gap: 6 },
  coverDivider: {
    width: '100%',
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 32,
  },
  coverTitleBlock: { alignItems: 'center', gap: 8 },
  coverEyebrow: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: 1.2,
  },
  coverCandidate: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.brand,
    textAlign: 'center',
    lineHeight: 1.2,
  },
  coverRace: { fontSize: 14, textAlign: 'center', lineHeight: 1.3 },
  coverLocation: {
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 1.3,
  },
  coverElection: {
    fontSize: 11,
    color: COLORS.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 1.3,
    marginTop: 6,
  },
  coverFooter: {
    position: 'absolute',
    bottom: 56,
    left: 56,
    right: 56,
    textAlign: 'center',
    fontSize: 9,
    color: COLORS.muted,
    fontStyle: 'italic',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    paddingBottom: 8,
    marginBottom: 18,
  },
  pageHeaderBrand: { flexDirection: 'row', alignItems: 'center' },
  pageHeaderBrandText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  pageHeaderRace: { fontSize: 9, color: COLORS.muted },
  sectionEyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    color: COLORS.brand,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: 'semibold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  tocTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  tocRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
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
  subTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 14,
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
  bullet: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: { width: 8, fontSize: 10 },
  bulletText: { flex: 1, fontSize: 10, lineHeight: 1.5 },
  defText: { fontSize: 10, lineHeight: 1.5 },
  defTerm: { fontWeight: 'bold' },
  table: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
    marginTop: 4,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: COLORS.tableHead,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  tableHeadCell: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  tableCell: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 9,
  },
  tableCellBold: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableCellMuted: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 9,
    color: COLORS.muted,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 56,
    right: 56,
  },
  footerDivider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: { fontSize: 9, color: COLORS.muted },
  footerPageBold: { fontSize: 9, color: COLORS.text, fontWeight: 'bold' },
  footerPageGroup: { flexDirection: 'row', alignItems: 'baseline' },
  glossary: {
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  glossaryRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  glossaryTerm: {
    width: 150,
    paddingRight: 12,
    fontSize: 10,
    fontWeight: 'bold',
  },
  glossaryDef: { flex: 1, fontSize: 10, color: COLORS.muted, lineHeight: 1.5 },
})

interface LogoProps {
  size?: number
}

const Logo = ({ size = 56 }: LogoProps): React.JSX.Element => {
  const width = size
  const height = (size / 160) * 130
  return (
    <Svg width={width} height={height} viewBox="0 0 160 130">
      <Path
        d="M80.014 123.163C112.708 107.269 134.411 89.4353 145.494 71.1394C154.822 55.6157 156.023 40.554 150.112 28.0795C144.755 16.8063 133.95 8.76726 121.389 6.64199C107.998 4.42431 94.4216 9.13688 83.7084 20.8721L79.9217 24.9378L76.1351 20.8721C65.3295 9.13688 51.7533 4.42431 38.4541 6.64199C25.9861 8.67486 15.0881 16.8063 9.73147 28.0795C3.82072 40.4616 5.02134 55.6157 14.3493 71.1394C25.4319 89.4353 47.1356 107.269 79.8294 123.163H80.014Z"
        fill="#FFFFFF"
      />
      <Path
        fillRule="evenodd"
        d="M80.0134 15.882C68.0995 3.40753 52.7686 -1.95188 37.5299 0.635414C23.0301 3.0379 10.4697 12.3707 4.18954 25.4919C-2.73713 40.184 -1.07479 57.5559 9.17668 74.3733C21.0905 94.1476 44.0871 112.628 77.3351 128.706L80.0134 130L82.6918 128.706C115.94 112.536 138.844 94.0552 150.85 74.3733C161.009 57.5559 162.764 40.184 155.837 25.4919C149.557 12.2782 136.997 3.0379 122.497 0.635414C107.258 -1.85947 91.9272 3.40753 80.0134 15.882ZM71.609 25.2147C62.0964 14.8656 50.5519 11.077 39.4693 12.9251C28.9408 14.6807 19.7975 21.5185 15.3645 30.8513C10.562 41.0156 11.2085 53.8597 19.7052 67.9974C29.5872 84.3528 49.259 100.985 79.9211 116.232C110.583 100.985 130.163 84.3528 140.137 67.9974C148.726 53.8597 149.28 41.0156 144.478 30.8513C140.045 21.4261 130.901 14.6807 120.373 12.9251C109.29 11.077 97.7456 14.8656 88.233 25.2147L79.9211 34.2702L71.609 25.2147Z"
        fill="#DC1438"
      />
      <Path
        d="M76.6892 78.5324L67.8232 83.1525C66.8996 83.6146 65.7913 83.2449 65.3295 82.4133C65.1448 82.0437 65.0524 81.6741 65.1448 81.2121L66.8073 71.5097C67.1767 69.1996 66.4378 66.8896 64.7754 65.3187L57.5717 58.3885C56.8329 57.6492 56.8329 56.5404 57.5717 55.8012C57.8488 55.524 58.2182 55.3392 58.6799 55.2468L68.6543 53.8607C70.9632 53.4911 72.9951 52.105 74.011 49.9797L78.444 41.109C78.9058 40.185 80.0141 39.8154 80.9377 40.2774C81.3071 40.4622 81.5841 40.7394 81.7688 41.109L86.2018 49.9797C87.2178 52.0126 89.2496 53.4911 91.5585 53.8607L101.533 55.2468C102.549 55.4316 103.288 56.3556 103.103 57.2796C103.103 57.6492 102.826 58.0188 102.549 58.296L95.3451 65.2263C93.6827 66.7971 92.8515 69.1997 93.3133 71.4174L94.9757 81.1197C95.1604 82.1361 94.5139 83.0602 93.498 83.245C93.1286 83.245 92.6668 83.2449 92.2973 83.0601L83.4313 78.44C81.3071 77.3311 78.8135 77.3311 76.7817 78.44L76.6892 78.5324Z"
        fill="#0048C2"
      />
    </Svg>
  )
}

interface PageHeaderProps {
  plan: PlanData
}

const PageHeader = ({ plan }: PageHeaderProps): React.JSX.Element => (
  <View style={styles.pageHeader} fixed>
    <View style={styles.pageHeaderBrand}>
      <Logo size={16} />
      <Text style={styles.pageHeaderBrandText}>GoodParty.org</Text>
    </View>
    <Text style={styles.pageHeaderRace}>
      {plan.candidateName} • {plan.race}
    </Text>
  </View>
)

const PageFooter = (): React.JSX.Element => (
  <View style={styles.footer} fixed>
    <View style={styles.footerDivider} />
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>
        Prepared by GoodParty.org • Empowering people to run, win, and serve
      </Text>
      <View style={styles.footerPageGroup}>
        <Text style={styles.footerText}>Page </Text>
        <Text
          style={styles.footerPageBold}
          render={({ pageNumber }) => `${pageNumber}`}
        />
        <Text style={styles.footerText}> of </Text>
        <Text
          style={styles.footerPageBold}
          render={({ totalPages }) => `${totalPages}`}
        />
      </View>
    </View>
  </View>
)

interface SectionHeaderProps {
  number: number
  title: string
}

const SectionHeader = ({
  number,
  title,
}: SectionHeaderProps): React.JSX.Element => (
  <View>
    <Text style={styles.sectionEyebrow}>Section {number}</Text>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
)

const TOC_ENTRIES: { label: string; page: number }[] = [
  { label: 'Executive Summary', page: 3 },
  { label: '1. Strategic Landscape', page: 5 },
  { label: '2. Electoral Goals & Key Metrics', page: 6 },
  { label: '3. Campaign Timeline', page: 7 },
  { label: '4. Recommended Budget', page: 8 },
  { label: '5. Community Engagement & Earned Media', page: 9 },
  { label: '6. Voter Contact Plan', page: 10 },
  { label: '7. Measurement & Accountability', page: 11 },
  { label: '8. Methodology & Data Sources', page: 12 },
  { label: '9. Glossary', page: 13 },
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

interface DefinitionListProps {
  items: { title: string; body: string }[]
}

const DefinitionList = ({ items }: DefinitionListProps): React.JSX.Element => (
  <View>
    {items.map((item) => (
      <View key={item.title} style={{ marginBottom: 6 }}>
        <Text style={styles.defText}>
          <Text style={styles.defTerm}>{item.title}</Text>{' '}
          <Text style={{ color: COLORS.muted }}>{item.body}</Text>
        </Text>
      </View>
    ))}
  </View>
)

interface TableProps {
  columns: { label: string; flex?: number; bold?: boolean; muted?: boolean }[]
  rows: string[][]
}

const Table = ({ columns, rows }: TableProps): React.JSX.Element => (
  <View style={styles.table}>
    <View style={styles.tableHead}>
      {columns.map((col) => (
        <Text
          key={col.label}
          style={[styles.tableHeadCell, { flex: col.flex ?? 1 }]}
        >
          {col.label}
        </Text>
      ))}
    </View>
    {rows.map((row, rIdx) => (
      <View key={rIdx} style={styles.tableRow} wrap={false}>
        {row.map((cell, cIdx) => {
          const col = columns[cIdx]
          const cellStyle = col?.bold
            ? styles.tableCellBold
            : col?.muted
            ? styles.tableCellMuted
            : styles.tableCell
          return (
            <Text key={cIdx} style={[cellStyle, { flex: col?.flex ?? 1 }]}>
              {cell}
            </Text>
          )
        })}
      </View>
    ))}
  </View>
)

interface CampaignPlanPdfProps {
  plan: PlanData
}

export const CampaignPlanPdf = ({
  plan,
}: CampaignPlanPdfProps): React.JSX.Element => (
  <Document title="Campaign Plan" author="GoodParty.org">
    {/* Cover */}
    <Page size="LETTER" style={styles.page}>
      <View style={styles.coverWrapper}>
        <View style={styles.coverHeader}>
          <Logo size={70} />
          <View style={{ height: 14 }} />
          <View style={styles.coverHeaderInner}>
            <Text style={styles.wordmark}>GoodParty.org</Text>
            <Text style={styles.wordmarkTagline}>
              Empowering people to run, win, and serve
            </Text>
          </View>
        </View>

        <View style={styles.coverDivider} />

        <View style={styles.coverTitleBlock}>
          <Text style={styles.coverEyebrow}>Campaign Plan</Text>
          <Text style={styles.coverCandidate}>{plan.candidateName}</Text>
          {plan.race ? (
            <Text style={styles.coverRace}>for {plan.race}</Text>
          ) : null}
          {plan.location ? (
            <Text style={styles.coverLocation}>{plan.location}</Text>
          ) : null}
          {plan.electionDate ? (
            <Text style={styles.coverElection}>
              Election Day: {plan.electionDate}
            </Text>
          ) : null}
        </View>
      </View>

      <Text style={styles.coverFooter}>
        Plan prepared by GoodParty.org&apos;s Win Campaign Intelligence System
        using public voter data and historical election results.
      </Text>
    </Page>

    {/* Table of Contents */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <TableOfContents />
      <PageFooter />
    </Page>

    {/* 1. Executive Summary */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={1} title="Executive Summary" />
      <Text style={styles.paraMuted}>
        This page is the whole plan in one view. If the candidate reads nothing
        else, read this.
      </Text>

      <Text style={styles.subTitle}>The Race</Text>
      <Text style={styles.para}>
        {plan.candidateName} is running for {plan.race}
        {plan.location ? ` in ${plan.location}` : ''}. The race is nonpartisan
        with {plan.opponentCount} opponents. Election Day is {plan.electionDate}
        . Because the electorate is small and no party cue appears on the
        ballot, the race is decided by name recognition and turnout, not
        ideological persuasion.
      </Text>

      <Text style={styles.subTitle}>The Win Condition</Text>
      <Text style={styles.para}>
        Our modeling projects voter turnout of{' '}
        {plan.projectedTurnout.toLocaleString('en-US')} (±10%), putting the
        threshold for a guaranteed win at{' '}
        {plan.winNumber.toLocaleString('en-US')} votes, a conservative 50% + 1
        target. Hitting that target requires{' '}
        {plan.voterContactGoal.toLocaleString('en-US')} quality voter touches
        across the cycle, delivered through matched phone data plus in-person
        visibility and earned media.
      </Text>

      <Text style={styles.subTitle}>Strategy at a Glance</Text>
      <DefinitionList items={plan.strategyBullets} />

      <Text style={styles.subTitle}>Key Numbers</Text>
      <Table
        columns={[
          { label: 'Metric', flex: 2 },
          { label: 'Target', flex: 1, bold: true },
        ]}
        rows={plan.keyNumbers.map((n) => [n.metric, n.target])}
      />

      <PageFooter />
    </Page>

    {/* Executive Summary continued */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />

      <Text style={styles.subTitle}>Timeline Highlights</Text>
      <BulletList
        items={plan.timelineHighlights.map(
          (h) => `${h.date}. ${h.description}`,
        )}
      />

      <Text style={styles.subTitle}>What You Must Commit Personally</Text>
      <BulletList items={plan.candidateCommitments} />

      <Text style={styles.subTitle}>Biggest Risks</Text>
      <DefinitionList items={plan.biggestRisks} />

      <PageFooter />
    </Page>

    {/* 2. Strategic Landscape */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={2} title="Strategic Landscape" />
      <Text style={styles.para}>
        Your district is a small, often nonpartisan electorate where name
        recognition and turnout, not ideological persuasion, decide most races.
        The following opportunities and challenges are framed against that
        reality.
      </Text>

      <Text style={styles.subTitle}>Opportunities</Text>
      <DefinitionList items={plan.opportunities} />

      <Text style={styles.subTitle}>Challenges</Text>
      <DefinitionList items={plan.challenges} />

      <Text style={styles.subTitle}>Competitive Read</Text>
      <Text style={styles.para}>
        This plan is deliberately opponent-agnostic. The campaign should produce
        a brief opponent memo covering each opponent&apos;s name-recognition
        baseline, their top one or two public positions, and any obvious
        coalitions they are courting. Until that memo exists, the plan assumes a
        neutral split and optimizes for your own turnout.
      </Text>

      <PageFooter />
    </Page>

    {/* 3. Electoral Goals & Key Metrics */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={3} title="Electoral Goals & Key Metrics" />
      <Text style={styles.para}>
        These are the numbers the campaign will manage against. Each metric
        includes its data source and the sensitivity we apply when
        re-forecasting weekly.
      </Text>

      <Table
        columns={[
          { label: 'Metric', flex: 2 },
          { label: 'Target', flex: 1, bold: true },
          { label: 'Source / Formula', flex: 3, muted: true },
        ]}
        rows={plan.metrics.map((m) => [m.metric, m.target, m.source])}
      />

      <Text style={styles.subTitle}>Why 5x the Win Number?</Text>
      <Text style={styles.para}>
        The industry convention to plan for roughly five voter-contact attempts
        per vote needed comes from two realities. First, not every attempt
        reaches the voter. Second, voters typically need multiple exposures
        before a name or message sticks. For a{' '}
        {plan.winNumber.toLocaleString('en-US')}-vote target,{' '}
        {plan.voterContactGoal.toLocaleString('en-US')} attempts yields roughly
        two to three actual, memorable contacts per likely voter, the minimum
        for reliable name recognition.
      </Text>

      <Text style={styles.subTitle}>Why a Volunteer-Hour Target?</Text>
      <Text style={styles.para}>
        Volunteer capacity, not money, is the binding constraint on most
        small-precinct campaigns. The {plan.volunteerHourTarget}-hour floor is a
        conservative estimate of what it takes to personally cover the
        civic-event schedule, run a small door-knocking program, and monitor
        Election Day operations.
      </Text>

      <PageFooter />
    </Page>

    {/* 4. Campaign Timeline */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={4} title="Campaign Timeline" />
      <Text style={styles.para}>
        Dates below are the hard gates the campaign must hit. Each is followed
        by an internal working deadline (one week earlier wherever possible) to
        preserve a buffer.
      </Text>

      <Table
        columns={[
          { label: 'Date', flex: 1.4 },
          { label: 'Milestone', flex: 3 },
          { label: 'Owner / Notes', flex: 2, muted: true },
        ]}
        rows={plan.timeline.map((t) => [t.date, t.milestone, t.owner])}
      />

      <PageFooter />
    </Page>

    {/* 5. Recommended Budget */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={5} title="Recommended Budget" />
      <Text style={styles.para}>
        The recommended total campaign budget is approximately $
        {plan.totalBudget.toLocaleString('en-US')}, calculated from a
        cost-per-vote benchmark of roughly $3 to $4 per targeted voter across
        all digital and phone channels, rounded for planning clarity. Every
        dollar should be directed toward high-impact outreach that drives name
        recognition and turnout.
      </Text>

      <Text style={styles.subTitle}>Line-Item Breakdown</Text>
      <Table
        columns={[
          { label: 'Category', flex: 2 },
          { label: 'Amount', flex: 1, bold: true },
          { label: 'Rationale', flex: 3, muted: true },
        ]}
        rows={plan.budgetLineItems.map((b) => [
          b.category,
          b.amount,
          b.rationale,
        ])}
      />

      <Text style={styles.subTitle}>What This Budget Does Not Cover</Text>
      <DefinitionList items={plan.budgetNotCovered} />

      <PageFooter />
    </Page>

    {/* 6. Community Engagement & Earned Media */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={6} title="Community Engagement & Earned Media" />
      <Text style={styles.para}>
        Earned media and in-person visibility are the highest-ROI channels in a
        race this size. A single mention in a local outlet or a strong showing
        at a civic association meeting can move more voters than any paid
        channel at this budget.
      </Text>

      <Text style={styles.subTitle}>Civic Events</Text>
      <Table
        columns={[
          { label: 'Event', flex: 2 },
          { label: 'Date', flex: 1 },
          { label: 'Why It Matters', flex: 3, muted: true },
        ]}
        rows={plan.civicEvents.map((e) => [e.event, e.date, e.why])}
      />

      <Text style={styles.subTitle}>Press / Media Outlets</Text>
      <Table
        columns={[
          { label: 'Outlet', flex: 2 },
          { label: 'Type', flex: 2, muted: true },
          { label: 'Pitch Angle', flex: 3, muted: true },
        ]}
        rows={plan.pressOutlets.map((o) => [o.outlet, o.type, o.angle])}
      />

      <Text style={styles.para}>
        Target at least one earned-media placement per week during the final
        month. Prepare a single-page fact sheet and two short op-ed drafts
        (under 200 words) that can be tailored quickly to each outlet&apos;s
        editorial voice.
      </Text>

      <PageFooter />
    </Page>

    {/* 7. Voter Contact Plan */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={7} title="Voter Contact Plan" />
      <Text style={styles.para}>
        The contact cadence below is designed so every likely voter receives at
        least one introductory touch before mail ballots arrive, at least one
        deadline reminder, and at least one Election-Day push. Peer-to-peer
        texts are the primary workhorse. Robocalls layer on top to catch
        landline-only voters.
      </Text>

      <Table
        columns={[
          { label: 'Date', flex: 1.2 },
          { label: 'Tactic', flex: 1.2 },
          { label: 'Audience', flex: 1.6, muted: true },
          { label: 'Purpose', flex: 2.5, muted: true },
          { label: 'Format', flex: 1.5, muted: true },
        ]}
        rows={plan.contactSchedule.map((s) => [
          s.date,
          s.tactic,
          s.audience,
          s.purpose,
          s.format,
        ])}
      />

      <Text style={styles.subTitle}>Expected Yield</Text>
      <Text style={styles.para}>
        Across these sends, the plan produces approximately{' '}
        {plan.voterContactGoal.toLocaleString('en-US')} quality touches against
        your voter universe, an average of roughly {plan.averageTouchesPerVoter}{' '}
        contacts per likely voter. Expected realized contact (accounting for
        deliverability and answer rates) is 60 to 70 percent of attempts.
      </Text>

      <Text style={styles.subTitle}>Message Discipline</Text>
      <Text style={styles.para}>
        Every send should carry the same three elements: your name in the first
        line, one concrete local issue (the same issue every time), and a single
        clear ask (register, request a ballot, vote on Election Day). Variation
        across sends dilutes recognition. Consistency is the point.
      </Text>

      <PageFooter />
    </Page>

    {/* 8. Measurement & Accountability */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={8} title="Measurement & Accountability" />
      <Text style={styles.para}>
        Your campaign manager should review the KPI dashboard every Monday and
        report variances against target the same day. The goal is not to hit
        every number exactly, but to catch trends early enough to reallocate
        effort.
      </Text>

      <Table
        columns={[
          { label: 'KPI', flex: 2.5 },
          { label: 'Target', flex: 2, bold: true },
          { label: 'Review Cadence', flex: 1.6, muted: true },
        ]}
        rows={plan.kpis.map((k) => [k.kpi, k.target, k.cadence])}
      />

      <PageFooter />
    </Page>

    {/* 9. Methodology & Data Sources */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={9} title="Methodology & Data Sources" />
      <Text style={styles.para}>
        This plan was produced by GoodParty.org&apos;s automated
        campaign-intelligence pipeline. Every metric in this document is an
        estimate derived from the sources below. Where applicable, we include a
        best-estimate confidence interval so you can understand how firm each
        number is.
      </Text>

      <Text style={styles.subTitle}>Data Sources</Text>
      <Table
        columns={[
          { label: 'Metric', flex: 2 },
          { label: 'Source', flex: 3, muted: true },
          { label: 'Last Updated', flex: 1.4, muted: true },
        ]}
        rows={plan.dataSources.map((d) => [d.metric, d.source, d.lastUpdated])}
      />

      <Text style={styles.subTitle}>Key Assumptions</Text>
      <BulletList items={plan.keyAssumptions} />

      <PageFooter />
    </Page>

    {/* Methodology continued */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />

      <Text style={styles.subTitle}>Confidence & Standard Error</Text>
      <Table
        columns={[
          { label: 'Estimate', flex: 2.5 },
          { label: 'Point Value', flex: 1.2, bold: true },
          { label: 'Estimated Range', flex: 1.8, muted: true },
          { label: 'Notes', flex: 2.5, muted: true },
        ]}
        rows={plan.confidenceEstimates.map((c) => [
          c.estimate,
          c.pointValue,
          c.range,
          c.notes,
        ])}
      />
      <Text style={styles.paraMuted}>
        Standard-error ranges reflect modeling uncertainty only. They do not
        account for late-breaking external events. Treat the point values as
        planning numbers and revisit weekly as turnout signals harden.
      </Text>

      <Text style={styles.subTitle}>What This Plan Does Not Do</Text>
      <BulletList items={plan.planDoesNotDo} />

      <PageFooter />
    </Page>

    {/* 10. Glossary */}
    <Page size="LETTER" style={styles.page}>
      <PageHeader plan={plan} />
      <SectionHeader number={10} title="Glossary" />
      <View style={styles.glossary}>
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
