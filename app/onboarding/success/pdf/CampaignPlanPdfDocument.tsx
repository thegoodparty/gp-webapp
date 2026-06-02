'use client'

import {
  Document,
  Font,
  Image,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer'
import type { PlanData } from '../components/planContent'

const FONT_OPEN_SANS = 'Open Sans'

Font.register({
  family: FONT_OPEN_SANS,
  fonts: [
    { src: '/fonts/OpenSans-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/OpenSans-Bold.ttf', fontWeight: 700 },
    {
      src: '/fonts/OpenSans-Italic.ttf',
      fontWeight: 400,
      fontStyle: 'italic',
    },
  ],
})

const COLOR = {
  navy: '#1a2a5e',
  red: '#DC1438',
  starBlue: '#0048C2',
  body: '#1f1f1f',
  muted: '#6b7280',
  rule: '#dcdcdc',
  rowAlt: '#eef2f8',
  white: '#ffffff',
}

const PAGE_PADDING_X = 56
const PAGE_PADDING_TOP = 56
const PAGE_PADDING_BOTTOM = 64

const styles = StyleSheet.create({
  page: {
    paddingTop: PAGE_PADDING_TOP,
    paddingBottom: PAGE_PADDING_BOTTOM,
    paddingHorizontal: PAGE_PADDING_X,
    fontFamily: FONT_OPEN_SANS,
    fontSize: 11,
    lineHeight: 1.5,
    color: COLOR.body,
  },
  coverPage: {
    padding: 0,
    fontFamily: FONT_OPEN_SANS,
    fontSize: 11,
    color: COLOR.body,
  },
  coverInner: {
    flex: 1,
    margin: 16,
    paddingHorizontal: 64,
    paddingTop: 80,
    paddingBottom: 64,
    borderWidth: 1,
    borderColor: '#e2e5ee',
    borderStyle: 'solid',
    flexDirection: 'column',
    alignItems: 'center',
  },
  coverBrandWrap: {
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
  },
  coverWordmark: {
    fontSize: 26,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.body,
    marginTop: 18,
    textAlign: 'center',
  },
  coverTagline: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: COLOR.muted,
    marginTop: 10,
    textAlign: 'center',
  },
  coverMiddle: {
    alignItems: 'center',
    marginTop: 96,
  },
  coverEyebrow: {
    fontSize: 30,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.navy,
    letterSpacing: 2,
    textAlign: 'center',
  },
  coverPreparedFor: {
    fontSize: 10,
    letterSpacing: 2,
    color: COLOR.muted,
    marginTop: 28,
  },
  coverCandidate: {
    fontSize: 22,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.body,
    marginTop: 6,
  },
  coverRace: {
    fontSize: 13,
    color: COLOR.muted,
    marginTop: 14,
  },
  coverElectionDate: {
    fontSize: 12,
    color: COLOR.muted,
    fontStyle: 'italic',
    marginTop: 4,
  },
  coverLiveLinkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 48,
  },
  coverQr: {
    width: 80,
    height: 80,
    marginRight: 18,
  },
  coverLiveLinkLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLOR.muted,
  },
  coverLiveLinkUrl: {
    fontSize: 11,
    color: COLOR.red,
    textDecoration: 'underline',
    marginTop: 4,
  },
  coverFooterDisclaimer: {
    position: 'absolute',
    bottom: 56,
    left: 80,
    right: 80,
    fontSize: 9,
    color: COLOR.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 1.55,
  },

  runningHeader: {
    position: 'absolute',
    top: 24,
    left: PAGE_PADDING_X,
    right: PAGE_PADDING_X,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.rule,
    borderBottomStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  runningHeaderBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  runningHeaderWordmark: {
    fontSize: 11,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.body,
  },
  runningHeaderMeta: {
    fontSize: 9,
    color: COLOR.muted,
  },

  runningFooterRule: {
    position: 'absolute',
    left: PAGE_PADDING_X,
    right: PAGE_PADDING_X,
    bottom: 44,
    height: 1,
    backgroundColor: COLOR.rule,
  },
  runningFooterLeft: {
    position: 'absolute',
    bottom: 28,
    left: PAGE_PADDING_X,
    right: PAGE_PADDING_X / 2 + 100,
    fontSize: 9,
    color: COLOR.muted,
  },
  runningFooterRight: {
    position: 'absolute',
    bottom: 28,
    right: PAGE_PADDING_X,
    width: 100,
    textAlign: 'right',
    fontSize: 9,
    color: COLOR.muted,
  },
  footerBoldWordmark: {
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.body,
  },

  bodyStart: {
    marginTop: 28,
  },

  sectionEyebrow: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLOR.starBlue,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.navy,
    marginBottom: 16,
  },
  intro: {
    fontSize: 10,
    color: COLOR.muted,
    fontStyle: 'italic',
    marginBottom: 14,
  },

  h3: {
    fontSize: 13,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.navy,
    marginTop: 14,
    marginBottom: 6,
  },

  para: {
    marginBottom: 10,
  },
  paraBold: {
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
  },

  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletDot: {
    width: 14,
    color: COLOR.body,
  },
  bulletText: {
    flex: 1,
  },

  definitionList: {
    marginBottom: 10,
  },
  definitionRow: {
    marginBottom: 6,
  },
  definitionTitle: {
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.body,
  },
  definitionBody: {
    color: COLOR.muted,
  },

  keyValueTable: {
    borderWidth: 1,
    borderColor: COLOR.rule,
    borderStyle: 'solid',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 12,
  },
  keyValueRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.rule,
    borderBottomStyle: 'solid',
  },
  keyValueRowLast: {
    borderBottomWidth: 0,
  },
  keyValueLabel: {
    width: 180,
    fontSize: 10,
    color: COLOR.muted,
  },
  keyValueValue: {
    flex: 1,
    fontSize: 11,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
  },

  table: {
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLOR.rule,
    borderStyle: 'solid',
    borderRadius: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLOR.navy,
  },
  tableHeaderCell: {
    color: COLOR.white,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    fontSize: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: COLOR.rule,
    borderTopStyle: 'solid',
  },
  tableRowAlt: {
    backgroundColor: COLOR.rowAlt,
  },
  tableCell: {
    fontSize: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
  },
  cellBold: {
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
  },
  cellMuted: {
    color: COLOR.muted,
  },

  transition: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: COLOR.rule,
    borderTopStyle: 'solid',
    fontSize: 10,
    color: COLOR.muted,
  },

  twoColRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  twoColCol: {
    flex: 1,
  },
})

type DocProps = {
  plan: PlanData
  liveUrl?: string
  liveQrDataUrl?: string
}

const HeartStarMark = ({ size = 44 }: { size?: number }) => (
  <Svg width={size} height={(size * 130) / 160} viewBox="0 0 160 130">
    <Path
      d="M80.014 123.163C112.708 107.269 134.411 89.4353 145.494 71.1394C154.822 55.6157 156.023 40.554 150.112 28.0795C144.755 16.8063 133.95 8.76726 121.389 6.64199C107.998 4.42431 94.4216 9.13688 83.7084 20.8721L79.9217 24.9378L76.1351 20.8721C65.3295 9.13688 51.7533 4.42431 38.4541 6.64199C25.9861 8.67486 15.0881 16.8063 9.73147 28.0795C3.82072 40.4616 5.02134 55.6157 14.3493 71.1394C25.4319 89.4353 47.1356 107.269 79.8294 123.163H80.014Z"
      fill={COLOR.white}
    />
    <Path
      fillRule="evenodd"
      d="M80.0134 15.882C68.0995 3.40753 52.7686 -1.95188 37.5299 0.635414C23.0301 3.0379 10.4697 12.3707 4.18954 25.4919C-2.73713 40.184 -1.07479 57.5559 9.17668 74.3733C21.0905 94.1476 44.0871 112.628 77.3351 128.706L80.0134 130L82.6918 128.706C115.94 112.536 138.844 94.0552 150.85 74.3733C161.009 57.5559 162.764 40.184 155.837 25.4919C149.557 12.2782 136.997 3.0379 122.497 0.635414C107.258 -1.85947 91.9272 3.40753 80.0134 15.882ZM71.609 25.2147C62.0964 14.8656 50.5519 11.077 39.4693 12.9251C28.9408 14.6807 19.7975 21.5185 15.3645 30.8513C10.562 41.0156 11.2085 53.8597 19.7052 67.9974C29.5872 84.3528 49.259 100.985 79.9211 116.232C110.583 100.985 130.163 84.3528 140.137 67.9974C148.726 53.8597 149.28 41.0156 144.478 30.8513C140.045 21.4261 130.901 14.6807 120.373 12.9251C109.29 11.077 97.7456 14.8656 88.233 25.2147L79.9211 34.2702L71.609 25.2147Z"
      fill={COLOR.red}
    />
    <Path
      d="M76.6892 78.5324L67.8232 83.1525C66.8996 83.6146 65.7913 83.2449 65.3295 82.4133C65.1448 82.0437 65.0524 81.6741 65.1448 81.2121L66.8073 71.5097C67.1767 69.1996 66.4378 66.8896 64.7754 65.3187L57.5717 58.3885C56.8329 57.6492 56.8329 56.5404 57.5717 55.8012C57.8488 55.524 58.2182 55.3392 58.6799 55.2468L68.6543 53.8607C70.9632 53.4911 72.9951 52.105 74.011 49.9797L78.444 41.109C78.9058 40.185 80.0141 39.8154 80.9377 40.2774C81.3071 40.4622 81.5841 40.7394 81.7688 41.109L86.2018 49.9797C87.2178 52.0126 89.2496 53.4911 91.5585 53.8607L101.533 55.2468C102.549 55.4316 103.288 56.3556 103.103 57.2796C103.103 57.6492 102.826 58.0188 102.549 58.296L95.3451 65.2263C93.6827 66.7971 92.8515 69.1997 93.3133 71.4174L94.9757 81.1197C95.1604 82.1361 94.5139 83.0602 93.498 83.245C93.1286 83.245 92.6668 83.2449 92.2973 83.0601L83.4313 78.44C81.3071 77.3311 78.8135 77.3311 76.7817 78.44L76.6892 78.5324Z"
      fill={COLOR.starBlue}
    />
  </Svg>
)

const RunningHeader = ({ headerMeta }: { headerMeta: string }) => (
  <View style={styles.runningHeader} fixed>
    <View style={styles.runningHeaderBrand}>
      <HeartStarMark size={14} />
      <Text style={styles.runningHeaderWordmark}>GoodParty.org</Text>
    </View>
    {headerMeta ? (
      <Text style={styles.runningHeaderMeta}>{headerMeta}</Text>
    ) : null}
  </View>
)

const RunningFooterLeft = () => (
  <Text style={styles.runningFooterLeft} fixed>
    Prepared by <Text style={styles.footerBoldWordmark}>GoodParty.org</Text> ·
    Empowering people to run, win, and serve
  </Text>
)

const RunningFooterPageNumber = () => (
  <Text
    style={styles.runningFooterRight}
    fixed
    render={({ pageNumber, totalPages }) => (
      <>
        Page <Text style={styles.footerBoldWordmark}>{pageNumber}</Text> of{' '}
        {totalPages}
      </>
    )}
  />
)

const RunningFooterRule = () => <View style={styles.runningFooterRule} fixed />

const Bullets = ({ items }: { items: React.ReactNode[] }) => (
  <View>
    {items.map((line, i) => (
      <View key={i} style={styles.bulletRow}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{line}</Text>
      </View>
    ))}
  </View>
)

const DefinitionList = ({
  items,
}: {
  items: { title: string; body: string }[]
}) => (
  <View style={styles.definitionList}>
    {items.map((item) => (
      <View key={item.title} style={styles.definitionRow}>
        <Text>
          <Text style={styles.definitionTitle}>{item.title}</Text>{' '}
          <Text style={styles.definitionBody}>{item.body}</Text>
        </Text>
      </View>
    ))}
  </View>
)

const KeyValueTable = ({
  rows,
}: {
  rows: { label: string; value: string }[]
}) => (
  <View style={styles.keyValueTable}>
    {rows.map((row, i) => (
      <View
        key={row.label}
        style={[
          styles.keyValueRow,
          i === rows.length - 1 ? styles.keyValueRowLast : {},
        ]}
      >
        <Text style={styles.keyValueLabel}>{row.label}</Text>
        <Text style={styles.keyValueValue}>{row.value}</Text>
      </View>
    ))}
  </View>
)

type CellRenderer = (
  row: Record<string, string>,
  key: string,
) => React.ReactNode

type ColumnDef = {
  key: string
  header: string
  width?: number
  flex?: number
  bold?: boolean
  muted?: boolean
}

const PlanTable = ({
  columns,
  rows,
}: {
  columns: ColumnDef[]
  rows: Record<string, string>[]
}) => {
  const colStyle = (c: ColumnDef): Record<string, number> =>
    c.width !== undefined ? { width: c.width } : { flex: c.flex ?? 1 }

  const cellRender: CellRenderer = (row, key) => row[key] ?? ''

  return (
    <View style={styles.table}>
      <View style={styles.tableHeaderRow}>
        {columns.map((c) => (
          <Text key={c.key} style={[styles.tableHeaderCell, colStyle(c)]}>
            {c.header}
          </Text>
        ))}
      </View>
      {rows.map((row, rIdx) => (
        <View
          key={rIdx}
          style={[styles.tableRow, rIdx % 2 === 1 ? styles.tableRowAlt : {}]}
          wrap={false}
        >
          {columns.map((c) => (
            <Text
              key={c.key}
              style={[
                styles.tableCell,
                colStyle(c),
                c.bold ? styles.cellBold : {},
                c.muted ? styles.cellMuted : {},
              ]}
            >
              {cellRender(row, c.key)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  )
}

const buildHeaderMeta = (plan: PlanData): string => {
  const districtPart = plan.hasDistrict ? plan.districtName : ''
  const locationPart = [districtPart, plan.location].filter(Boolean).join(', ')
  const racePart = plan.candidateName
    ? `${plan.candidateName} for ${plan.race || 'Your race'}`
    : plan.race
  return [racePart, locationPart].filter(Boolean).join(' · ')
}

const SectionPage = ({
  number,
  title,
  headerMeta,
  intro,
  children,
  transition,
}: {
  number: number
  title: string
  headerMeta: string
  intro?: string
  children: React.ReactNode
  transition?: string
}) => (
  <Page size="LETTER" style={styles.page}>
    <RunningHeader headerMeta={headerMeta} />
    <View style={styles.bodyStart}>
      <Text style={styles.sectionEyebrow}>SECTION {number}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      {intro ? <Text style={styles.intro}>{intro}</Text> : null}
      {children}
      {transition ? <Text style={styles.transition}>{transition}</Text> : null}
    </View>
    <RunningFooterRule />
    <RunningFooterLeft />
    <RunningFooterPageNumber />
  </Page>
)

const CoverPage = ({
  plan,
  liveUrl,
  liveQrDataUrl,
}: {
  plan: PlanData
  liveUrl?: string
  liveQrDataUrl?: string
}) => (
  <Page size="LETTER" style={styles.coverPage}>
    <View style={styles.coverInner}>
      <View style={styles.coverBrandWrap}>
        <HeartStarMark size={72} />
        <Text style={styles.coverWordmark}>GoodParty.org</Text>
        <Text style={styles.coverTagline}>
          EMPOWERING PEOPLE TO RUN, WIN, AND SERVE
        </Text>
      </View>

      <View style={styles.coverMiddle}>
        <Text style={styles.coverEyebrow}>CAMPAIGN PLAN</Text>
        <Text style={styles.coverCandidate}>
          {plan.candidateName} for {plan.race || 'Your race'}
        </Text>
        {plan.hasDistrict || plan.location ? (
          <Text style={styles.coverRace}>
            {[plan.hasDistrict ? plan.districtName : '', plan.location]
              .filter(Boolean)
              .join(', ')}
          </Text>
        ) : null}
        {plan.electionDate ? (
          <Text style={styles.coverElectionDate}>
            Election Day: {plan.electionDate}
          </Text>
        ) : null}

        {liveQrDataUrl && liveUrl ? (
          <View style={styles.coverLiveLinkWrap}>
            {/* react-pdf Image is a PDF primitive, not a DOM <img>. */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={liveQrDataUrl} style={styles.coverQr} />
            <View>
              <Text style={styles.coverLiveLinkLabel}>VIEW YOUR LIVE PLAN</Text>
              <Text style={styles.coverLiveLinkUrl}>{liveUrl}</Text>
            </View>
          </View>
        ) : null}
      </View>

      <Text style={styles.coverFooterDisclaimer}>
        Campaign plan prepared by GoodParty.org&apos;s Campaign Intelligence
        System using public voter data and historical election results. ·{' '}
        {plan.planGenerationDate}
      </Text>
    </View>
  </Page>
)

const theRaceCopy = (plan: PlanData): string => {
  const district = plan.hasDistrict ? ` representing ${plan.districtName}` : ''
  const electionTypeLabel =
    plan.electionType === 'partisan'
      ? 'a partisan election'
      : plan.electionType === 'nonpartisan'
      ? 'a nonpartisan election'
      : 'a race'

  if (plan.opponentCount === 0) {
    return `You are running for ${plan.race}${district}. As of ${plan.planGenerationDate}, the race is uncontested — we'll update this plan as we become aware of candidates entering the race. Election Day is ${plan.electionDate}. Because the electorate is small and no party cue appears on the ballot, the race is decided by name recognition and turnout, not by ideological persuasion.`
  }
  if (plan.incumbent) {
    const noun = plan.opponentCount === 1 ? 'opponent' : 'opponents'
    return `You are running for ${plan.race}${district}. As of ${plan.planGenerationDate}, the race is ${electionTypeLabel} with ${plan.opponentCount} ${noun}, including the incumbent ${plan.incumbent.fullName}. Election Day is ${plan.electionDate}. Beating an incumbent requires giving voters a concrete reason to switch, not just an alternative to choose.`
  }
  const noun = plan.opponentCount === 1 ? 'opponent' : 'opponents'
  return `You are running for ${plan.race}${district}. As of ${plan.planGenerationDate}, the race is ${electionTypeLabel} with ${plan.opponentCount} ${noun}. Election Day is ${plan.electionDate}. Because the electorate is small and no party cue appears on the ballot, the race is decided by name recognition and turnout, not by ideological persuasion.`
}

const oppositionCopy = (plan: PlanData): string | null => {
  if (plan.opponentCount > 0) return null
  if (plan.filingDateStart && plan.filingDateEnd) {
    return `Candidates begin filing on ${plan.filingDateStart} and the filing window closes on ${plan.filingDateEnd}. Before ${plan.filingDateStart}, we don't yet know who will be on the ballot with you, so this section is a placeholder. We'll automatically check for new filings starting on ${plan.filingDateStart} and update this section as candidates enter the race.`
  }
  if (plan.filingDateEnd) {
    return `The filing deadline for this race is on ${plan.filingDateEnd}. We don't yet have a complete picture of who will be on the ballot with you, but we'll automatically check for new filings and update this section as candidates enter the race.`
  }
  return `We'll automatically check for opponents and update this section as we become aware of candidates entering the race.`
}

const districtLabel = (plan: PlanData): string =>
  plan.hasDistrict ? plan.districtName : 'Your district'

export const CampaignPlanPdfDocument = ({
  plan,
  liveUrl,
  liveQrDataUrl,
}: DocProps) => {
  const opposition = oppositionCopy(plan)
  const headerMeta = buildHeaderMeta(plan)

  return (
    <Document
      title={`Campaign plan — ${plan.candidateName || 'Candidate'}`}
      author="GoodParty.org"
      subject="Initial campaign plan"
    >
      <CoverPage plan={plan} liveUrl={liveUrl} liveQrDataUrl={liveQrDataUrl} />

      {/* 1. Executive Summary */}
      <SectionPage
        number={1}
        title="Executive Summary"
        headerMeta={headerMeta}
        intro="This is the whole plan in one view. If you read nothing else, read this."
        transition="The race is mapped by your opponents, your projected votes needed to win, and your timeline. What shapes everything else is you. Continue to your Campaign Manager and we'll help rebuild this plan around you specifically."
      >
        <Text style={styles.h3}>The Race</Text>
        <Text style={styles.para}>{theRaceCopy(plan)}</Text>

        <Text style={styles.h3}>Projected Votes Needed to Win</Text>
        <Text style={styles.para}>
          Our modeling projects voter turnout of{' '}
          <Text style={styles.paraBold}>
            {plan.projectedTurnout.toLocaleString('en-US')} voters
          </Text>
          , putting the threshold for a win at{' '}
          <Text style={styles.paraBold}>
            {plan.winNumber.toLocaleString('en-US')} votes
          </Text>{' '}
          — a simple majority (50% + 1) of voters who cast a ballot. Hitting
          that target requires{' '}
          <Text style={styles.paraBold}>
            {plan.voterContactGoal.toLocaleString('en-US')} voter contacts
          </Text>{' '}
          across the cycle (roughly 5 contacts per targeted voter).
        </Text>

        <Text style={styles.h3}>Campaign Plan at a Glance</Text>
        <DefinitionList items={plan.planAtAGlance} />

        <Text style={styles.h3}>Key Campaign Targets</Text>
        <KeyValueTable
          rows={plan.keyCampaignTargets.map((t) => ({
            label: t.metric,
            value: t.target,
          }))}
        />

        <Text style={styles.h3}>Key Dates</Text>
        <Bullets
          items={plan.keyDates.map((d) => (
            <Text key={`${d.date}-${d.description}`}>
              <Text style={styles.paraBold}>{d.date}.</Text>{' '}
              <Text style={styles.definitionBody}>{d.description}</Text>
            </Text>
          ))}
        />
      </SectionPage>

      {/* 2. Strategic Landscape */}
      <SectionPage
        number={2}
        title="Strategic Landscape"
        headerMeta={headerMeta}
        intro={`${districtLabel(
          plan,
        )} is an electorate where name recognition and turnout (not ideological persuasion) decide most races. The following opportunities and challenges are framed against that reality.`}
        transition="The strategic landscape is drawn from public data and historical election results. Head to your Campaign Manager to share your platform and your opponents, and we'll reframe these around what you stand for."
      >
        <View style={styles.twoColRow}>
          <View style={styles.twoColCol}>
            <Text style={styles.h3}>Opportunities</Text>
            <Bullets items={plan.opportunities} />
          </View>
          <View style={styles.twoColCol}>
            <Text style={styles.h3}>Challenges</Text>
            <Bullets items={plan.challenges} />
          </View>
        </View>

        <Text style={styles.h3}>Opposition Research</Text>
        {opposition ? (
          <Text style={styles.para}>{opposition}</Text>
        ) : (
          plan.opponents.map((opp) => (
            <View key={opp.fullName} style={styles.para}>
              <Text style={styles.paraBold}>{opp.fullName}</Text>
              <Bullets
                items={[
                  ...(opp.partyAffiliation
                    ? [`Party: ${opp.partyAffiliation}`]
                    : []),
                  ...(opp.incumbent === true ? ['Incumbent'] : []),
                  ...(opp.politicalSummary ? [opp.politicalSummary] : []),
                  ...opp.keyFacts,
                  ...opp.websites,
                ]}
              />
            </View>
          ))
        )}
      </SectionPage>

      {/* 3. Voter Insights For Your District */}
      <SectionPage
        number={3}
        title="Voter Insights For Your District"
        headerMeta={headerMeta}
        intro={
          plan.voterInsightsSource === 'district'
            ? 'The issues below come from district-level survey data on what voters here care about most right now. Personalize your platform around them in Campaign Manager.'
            : plan.voterInsightsSource === 'candidate'
            ? 'The issues below are the ones you flagged during onboarding. Keep them updated in Campaign Manager as your platform evolves.'
            : 'These are common top issues in races at this level. Personalize them in Campaign Manager to align your plan with the actual race.'
        }
        transition="Voter insights sharpen as you fill in your platform and we layer in district-specific survey data. Update your issues in Campaign Manager and this section will re-frame around your priorities."
      >
        <DefinitionList
          items={plan.voterInsightsIssues.map((i) => ({
            title: i.title,
            body: i.description,
          }))}
        />
      </SectionPage>

      {/* 4. Electoral Goals & Key Metrics */}
      <SectionPage
        number={4}
        title="Electoral Goals & Key Metrics"
        headerMeta={headerMeta}
        intro={`The numbers below are projected from historical voter data and proprietary models for ${districtLabel(
          plan,
        )}.`}
        transition="These projections come straight from public voter data and proprietary models. Once you confirm your platform in Campaign Manager, we can re-forecast against the audience you're actually targeting."
      >
        <PlanTable
          columns={[
            { key: 'metric', header: 'Metric', flex: 1.4 },
            { key: 'target', header: 'Target', flex: 1.2, bold: true },
            { key: 'source', header: 'Source / Formula', flex: 2, muted: true },
          ]}
          rows={plan.metrics.map((m) => ({
            metric: m.metric,
            target: m.target,
            source: m.source,
          }))}
        />
      </SectionPage>

      {/* 5. Campaign Timeline */}
      <SectionPage
        number={5}
        title="Campaign Timeline"
        headerMeta={headerMeta}
        intro="Dates below are the hard gates the campaign must hit. Each is followed by an internal working deadline (one week earlier wherever possible) to preserve a buffer."
        transition="The key dates you need to know about your race have been established. Share your launch event, fundraising rollout, and issue moments in Campaign Manager and we'll turn this into a working plan."
      >
        <PlanTable
          columns={[
            { key: 'date', header: 'Date', width: 110, bold: true },
            { key: 'milestone', header: 'Milestone', flex: 1.6 },
            { key: 'notes', header: 'Notes', flex: 1.4, muted: true },
          ]}
          rows={plan.timeline.map((t) => ({
            date: t.date,
            milestone: t.milestone,
            notes: t.notes,
          }))}
        />
      </SectionPage>

      {/* 6. Projected Minimum Resources Needed */}
      <SectionPage
        number={6}
        title="Projected Minimum Resources Needed"
        headerMeta={headerMeta}
        intro={`We project that you need at least ${plan.winNumber.toLocaleString(
          'en-US',
        )} votes to win, with at least ${
          plan.weeksRemaining
        } weeks left to campaign. Recommended total budget is approximately $${plan.totalBudget.toLocaleString(
          'en-US',
        )} for outreach, compliance and fees, while ${plan.totalCampaignHours.toLocaleString(
          'en-US',
        )} volunteer hours are needed for in-person campaigning, events, and volunteers.`}
        transition={`The $${plan.totalBudget.toLocaleString(
          'en-US',
        )} floor covers your minimum voter contact goal across digital and phone channels at a generic cost-per-vote benchmark. The real budget and how it gets spent depends on two things we don't yet know: what you can raise, and which voter you should specifically target.`}
      >
        <Text style={styles.h3}>
          Budget Breakdown (based on {plan.weeksRemaining} weeks in campaign)
        </Text>
        <PlanTable
          columns={[
            { key: 'category', header: 'Category', flex: 1.2 },
            { key: 'amount', header: 'Amount', width: 90, bold: true },
            { key: 'rationale', header: 'Rationale', flex: 2.2, muted: true },
          ]}
          rows={plan.budgetLineItems.map((b) => ({
            category: b.category,
            amount: b.amount,
            rationale: b.rationale,
          }))}
        />

        <Text style={styles.h3}>How to Raise This</Text>
        <Text style={styles.para}>
          <Text style={styles.paraBold}>
            ${plan.totalBudget.toLocaleString('en-US')}
          </Text>{' '}
          sounds like real money. For most candidates at this level, it comes
          from a surprisingly small number of people, typically 20 to 40 donors
          giving $25 to $100 each. For a race like yours, the default starting
          fundraising mix looks like this:
        </Text>
        <PlanTable
          columns={[
            { key: 'source', header: 'Source', flex: 2 },
            { key: 'share', header: 'Share', width: 80, bold: true },
          ]}
          rows={plan.fundraisingMix.map((f) => ({
            source: f.source,
            share: f.share,
          }))}
        />

        <Text style={styles.h3}>
          Time Breakdown (based on {plan.weeksRemaining} weeks in campaign)
        </Text>
        <PlanTable
          columns={[
            { key: 'category', header: 'Category', flex: 1.2 },
            { key: 'amount', header: 'Amount', width: 110, bold: true },
            { key: 'rationale', header: 'Rationale', flex: 2.2, muted: true },
          ]}
          rows={plan.timeBreakdown.map((t) => ({
            category: t.category,
            amount: t.amount,
            rationale: t.rationale,
          }))}
        />
      </SectionPage>

      {/* 7. Community Engagement & Earned Media */}
      <SectionPage
        number={7}
        title="Community Engagement & Earned Media"
        headerMeta={headerMeta}
        intro="Earned media and in-person visibility are the highest-ROI channels in a race this size. A single mention in a local outlet or a strong showing at a civic association meeting can move more voters than any paid channel at this budget."
        transition="These are your highest-value rooms and your best media targets. Once you tell us why you're running and what you stand for in Campaign Manager, we can turn this list into ready-to-use talking points and press pitches."
      >
        <Text style={styles.h3}>Community Events</Text>
        <PlanTable
          columns={[
            { key: 'event', header: 'Event', flex: 1.5 },
            { key: 'address', header: 'Address', flex: 1.3, muted: true },
            { key: 'date', header: 'Date', width: 90 },
            { key: 'why', header: 'Why It Matters', flex: 1.8, muted: true },
          ]}
          rows={plan.civicEvents.map((e) => ({
            event: e.event,
            address: e.address,
            date: e.date,
            why: e.why,
          }))}
        />

        <Text style={styles.h3}>Press & Media Outlets</Text>
        <Text style={styles.para}>
          Target at least one earned-media placement per week between{' '}
          <Text style={styles.paraBold}>
            {plan.contactWindowStart || '{12_weeks_before_election_date}'}
          </Text>{' '}
          and{' '}
          <Text style={styles.paraBold}>
            {plan.electionDate || '{election_date}'}
          </Text>
          .
        </Text>
        <PlanTable
          columns={[
            { key: 'outlet', header: 'Outlet', flex: 1.3 },
            { key: 'type', header: 'Type', flex: 1.4, muted: true },
            { key: 'angle', header: 'Pitch Angle', flex: 1.8, muted: true },
            { key: 'contact', header: 'Contact', flex: 1.5, muted: true },
          ]}
          rows={plan.pressOutlets.map((o) => ({
            outlet: o.outlet,
            type: o.type,
            angle: o.angle,
            contact: o.contact,
          }))}
        />
      </SectionPage>

      {/* 8. Voter Contact Plan */}
      <SectionPage
        number={8}
        title="Voter Contact Plan"
        headerMeta={headerMeta}
        intro="The contact cadence below is designed so that every likely voter receives at least 1 introductory contact, 1 persuasion contact, 1 early-vote reminder, and 1 Election Day push. Texts are the primary workhorse; robocalls layer on top to catch landline-only voters."
        transition="This plan puts you in front of every likely voter at the right moment. But repeated exposure only converts to votes if the message is specific and credible. Once you share your issues and your story in Campaign Manager, we'll help you build the actual message."
      >
        <PlanTable
          columns={[
            { key: 'date', header: 'Date', width: 100, bold: true },
            { key: 'tactic', header: 'Tactic', width: 90, bold: true },
            { key: 'purpose', header: 'Purpose', flex: 2, muted: true },
          ]}
          rows={plan.contactSchedule.map((s) => ({
            date: s.date,
            tactic: s.tactic,
            purpose: s.purpose,
          }))}
        />

        <Text style={styles.h3}>Expected Outcome</Text>
        <Text style={styles.para}>
          Across <Text style={styles.paraBold}>7 voter contact campaigns</Text>,
          this plan produces over{' '}
          <Text style={styles.paraBold}>
            {plan.voterContactGoal.toLocaleString('en-US')} voter contacts
          </Text>{' '}
          against the group of{' '}
          <Text style={styles.paraBold}>
            {plan.winNumber.toLocaleString('en-US')} voters
          </Text>
          , more than the 5 contacts per likely voter. Expected realized contact
          (accounting for deliverability and answer rates) is{' '}
          <Text style={styles.paraBold}>~60–70%</Text> of voter contacts, which
          clears the threshold for reliable name recognition in a nonpartisan
          race.
        </Text>
      </SectionPage>

      {/* 9. Measurement & Accountability */}
      <SectionPage
        number={9}
        title="Measurement & Accountability"
        headerMeta={headerMeta}
        transition="The measurement system is live in Campaign Manager. Once you personalize your plan with your goals, capacity, and timeline, the dashboard starts tracking the campaign you're actually running."
      >
        <Text style={styles.para}>
          Every week, log into your Campaign Manager to check your progress. We
          estimate the number of likely votes you are on track to receive based
          on the activity you complete. Our proprietary models predict the
          number of likely votes you get, based on the{' '}
          <Text style={styles.paraBold}>quality</Text> and{' '}
          <Text style={styles.paraBold}>frequency</Text> of{' '}
          <Text style={styles.paraBold}>voter contacts</Text>.
        </Text>
        <Text style={styles.para}>
          This number will grow as you work through your voter contact plan. It
          will never reach 100% — that is by design. No campaign plan can
          guarantee an outcome, and there is always another action that can
          increase your chances of winning.
        </Text>
        <Text style={styles.h3}>How to read your progress</Text>
        <Bullets
          items={[
            'If your likely votes are tracking toward your projected votes needed to win, stay the course.',
            'If you are falling behind, prioritize scheduling your next text or robocall campaign and look for additional outreach opportunities.',
            'Check in at least once a week — small gaps caught early are easy to close; the same gap caught in the final week is not.',
          ]}
        />
      </SectionPage>

      {/* 10. Methodology & Data Sources */}
      <SectionPage
        number={10}
        title="Methodology & Data Sources"
        headerMeta={headerMeta}
        intro="This plan was produced by GoodParty.org using public voter data, historical election results, and our proprietary models. Every metric in this document is an estimate derived from the sources below."
        transition="This plan is a working starting point. All estimates should be revisited weekly as new data arrives."
      >
        <Text style={styles.h3}>Data Sources</Text>
        <PlanTable
          columns={[
            { key: 'metric', header: 'Metric', flex: 1.4 },
            { key: 'source', header: 'Source', flex: 2, muted: true },
            {
              key: 'lastUpdated',
              header: 'Last Updated',
              flex: 1.2,
              muted: true,
            },
          ]}
          rows={plan.dataSources.map((d) => ({
            metric: d.metric,
            source: d.source,
            lastUpdated: d.lastUpdated,
          }))}
        />

        <Text style={styles.h3}>Key Assumptions</Text>
        <Bullets items={plan.keyAssumptions} />

        <Text style={styles.h3}>Confidence & Standard Error</Text>
        <PlanTable
          columns={[
            { key: 'estimate', header: 'Estimate', flex: 1.6 },
            { key: 'pointValue', header: 'Point Value', width: 90, bold: true },
            { key: 'range', header: 'Range (95% CI)', width: 110, muted: true },
            { key: 'notes', header: 'Notes', flex: 1.6, muted: true },
          ]}
          rows={plan.confidenceEstimates.map((c) => ({
            estimate: c.estimate,
            pointValue: c.pointValue,
            range: c.range,
            notes: c.notes,
          }))}
        />

        <Text style={styles.h3}>What This Plan Does Not Do</Text>
        <Bullets items={plan.planDoesNotDo} />
      </SectionPage>

      {/* 11. Glossary */}
      <SectionPage number={11} title="Glossary" headerMeta={headerMeta}>
        <PlanTable
          columns={[
            { key: 'term', header: 'Term', flex: 1, bold: true },
            { key: 'definition', header: 'Definition', flex: 3, muted: true },
          ]}
          rows={plan.glossary.map((g) => ({
            term: g.term,
            definition: g.definition,
          }))}
        />
      </SectionPage>
    </Document>
  )
}
