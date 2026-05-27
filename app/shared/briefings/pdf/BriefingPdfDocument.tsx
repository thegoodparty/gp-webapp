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
import type { Briefing, Item } from '../types'

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
  },
  coverBody: {
    fontSize: 18,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.navy,
    marginTop: 28,
  },
  coverPrepared: {
    fontSize: 12,
    color: COLOR.body,
    marginTop: 18,
  },
  coverMeta: {
    fontSize: 11,
    color: COLOR.body,
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

  runningFooter: {
    position: 'absolute',
    bottom: 28,
    left: PAGE_PADDING_X,
    right: PAGE_PADDING_X,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLOR.rule,
    borderTopStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  h1: {
    fontSize: 28,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.navy,
    marginBottom: 6,
  },
  h1Sub: {
    fontSize: 11,
    color: COLOR.muted,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  h2: {
    fontSize: 14,
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
    color: COLOR.navy,
    marginTop: 18,
    marginBottom: 8,
  },
  para: {
    marginBottom: 10,
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
  newsOutlet: {
    fontStyle: 'italic',
  },

  quoteWrap: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 10,
  },
  quoteBar: {
    width: 2,
    backgroundColor: COLOR.navy,
    marginRight: 12,
  },
  quoteBody: {
    flex: 1,
  },
  quoteText: {
    fontSize: 11,
    color: COLOR.body,
  },
  quoteAttribution: {
    fontSize: 9,
    color: COLOR.muted,
    letterSpacing: 1,
    marginTop: 4,
  },

  tocRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.rule,
    borderBottomStyle: 'solid',
  },
  tocLabel: { flex: 1, fontSize: 12 },
  tocPage: { fontSize: 11, color: COLOR.body, marginLeft: 12 },

  table: {
    marginTop: 8,
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
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableRowAlt: {
    backgroundColor: COLOR.rowAlt,
  },
  tableCell: {
    fontSize: 11,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableCellBold: {
    fontFamily: FONT_OPEN_SANS,
    fontWeight: 700,
  },
  colNum: { width: 44 },
  colItem: { flex: 1 },
  colDetail: { width: 90, textAlign: 'right' },
})

const FEATURED_TIERS: Item['tier'][] = ['featured', 'queued']

type DocProps = {
  briefing: Briefing
  preparedForLine?: string
  meetingMetaLine?: string
  liveBriefingUrl?: string
  liveBriefingQrDataUrl?: string
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

const RunningHeader = ({ meetingMetaLine }: { meetingMetaLine?: string }) => (
  <View style={styles.runningHeader} fixed>
    <View style={styles.runningHeaderBrand}>
      <HeartStarMark size={14} />
      <Text style={styles.runningHeaderWordmark}>GoodParty.org</Text>
    </View>
    {meetingMetaLine ? (
      <Text style={styles.runningHeaderMeta}>{meetingMetaLine}</Text>
    ) : null}
  </View>
)

const RunningFooter = () => (
  <View style={styles.runningFooter} fixed>
    <Text>
      Prepared by <Text style={styles.footerBoldWordmark}>GoodParty.org</Text> ·
      Empowering people to run, win, and serve
    </Text>
    <Text
      render={({ pageNumber, totalPages }) => (
        <>
          Page <Text style={styles.footerBoldWordmark}>{pageNumber}</Text> of{' '}
          {totalPages}
        </>
      )}
    />
  </View>
)

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

const CoverPage = ({
  briefing,
  preparedForLine,
  meetingMetaLine,
  liveBriefingUrl,
  liveBriefingQrDataUrl,
}: DocProps) => (
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
        <Text style={styles.coverEyebrow}>MEETING BRIEFING</Text>
        <Text style={styles.coverBody}>{briefing.title}</Text>
        {preparedForLine ? (
          <Text style={styles.coverPrepared}>
            Prepared for {preparedForLine}
          </Text>
        ) : null}
        {meetingMetaLine ? (
          <Text style={styles.coverMeta}>{meetingMetaLine}</Text>
        ) : (
          <Text style={styles.coverMeta}>{briefing.meeting_date}</Text>
        )}

        {liveBriefingQrDataUrl && liveBriefingUrl ? (
          <View style={styles.coverLiveLinkWrap}>
            {/* react-pdf Image is a PDF primitive, not a DOM <img>. */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={liveBriefingQrDataUrl} style={styles.coverQr} />
            <View>
              <Text style={styles.coverLiveLinkLabel}>
                VIEW YOUR LIVE BRIEFING
              </Text>
              <Text style={styles.coverLiveLinkUrl}>{liveBriefingUrl}</Text>
            </View>
          </View>
        ) : null}
      </View>

      <Text style={styles.coverFooterDisclaimer}>
        Briefing prepared by GoodParty.org using public agenda data, constituent
        sentiment, and local news coverage. · v1.0
      </Text>
    </View>
  </Page>
)

const TocPage = ({
  meetingMetaLine,
  featured,
}: DocProps & { featured: { item: Item; index: number }[] }) => (
  <Page size="LETTER" style={styles.page}>
    <RunningHeader meetingMetaLine={meetingMetaLine} />

    <View style={styles.bodyStart}>
      <Text style={styles.h1}>Table of Contents</Text>

      <View style={styles.tocRow}>
        <Text style={styles.tocLabel}>Executive Summary</Text>
        <Text style={styles.tocPage}>3</Text>
      </View>
      {featured.map(({ item }, i) => (
        <View key={item.id} style={styles.tocRow}>
          <Text style={styles.tocLabel}>
            {i + 1}. {item.title}
          </Text>
          <Text style={styles.tocPage}>{4 + i}</Text>
        </View>
      ))}
      <View style={styles.tocRow}>
        <Text style={styles.tocLabel}>{featured.length + 1}. Full Agenda</Text>
        <Text style={styles.tocPage}>{4 + featured.length}</Text>
      </View>
    </View>

    <RunningFooter />
  </Page>
)

const ExecutiveSummaryPage = ({
  briefing,
  meetingMetaLine,
  featured,
}: DocProps & { featured: { item: Item; index: number }[] }) => (
  <Page size="LETTER" style={styles.page}>
    <RunningHeader meetingMetaLine={meetingMetaLine} />

    <View style={styles.bodyStart}>
      <Text style={styles.h1}>Executive Summary</Text>
      <Text style={styles.h1Sub}>{briefing.executive_summary.lead_in}</Text>

      {featured.length > 0 ? (
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colNum]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colItem]}>Item</Text>
            <Text style={[styles.tableHeaderCell, styles.colDetail]}>
              Detail
            </Text>
          </View>
          {featured.map(({ item }, i) => (
            <View
              key={item.id}
              style={[styles.tableRow, i % 2 === 0 ? styles.tableRowAlt : {}]}
            >
              <Text
                style={[styles.tableCell, styles.colNum, styles.tableCellBold]}
              >
                {i + 1}
              </Text>
              <Text
                style={[styles.tableCell, styles.colItem, styles.tableCellBold]}
              >
                {item.title}
              </Text>
              <Text style={[styles.tableCell, styles.colDetail]}>
                See p. {4 + i}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>

    <RunningFooter />
  </Page>
)

const ItemPage = ({
  meetingMetaLine,
  item,
  position,
  totalCount,
}: DocProps & { item: Item; position: number; totalCount: number }) => {
  const d = item.display
  const sentiment = d.constituent_sentiment
  return (
    <Page size="LETTER" style={styles.page}>
      <RunningHeader meetingMetaLine={meetingMetaLine} />

      <View style={styles.bodyStart}>
        <Text style={styles.h1}>
          {position}. {item.title}
        </Text>
        {item.item_number ? (
          <Text style={styles.h1Sub}>
            Agenda item {item.item_number} of {totalCount}.
          </Text>
        ) : null}

        <Text style={styles.h2}>Overview</Text>
        <Text style={styles.para}>{d.summary}</Text>

        {d.budget_impact ? (
          <>
            <Text style={styles.h2}>Budget impact</Text>
            <Text style={styles.para}>{d.budget_impact.summary}</Text>
          </>
        ) : null}

        {sentiment ? (
          <>
            <Text style={styles.h2}>Constituent sentiment</Text>
            <Text style={styles.para}>{sentiment.summary}</Text>
            {sentiment.detail ? (
              <Text style={styles.para}>{sentiment.detail}</Text>
            ) : null}
          </>
        ) : null}

        {d.recent_news && d.recent_news.length > 0 ? (
          <>
            <Text style={styles.h2}>Recent news</Text>
            <Bullets
              items={d.recent_news.map((n, i) => (
                <Text key={i}>
                  {n.headline} —{' '}
                  <Text style={styles.newsOutlet}>{n.publication}</Text>
                </Text>
              ))}
            />
          </>
        ) : null}

        {d.talking_points && d.talking_points.length > 0 ? (
          <>
            <Text style={styles.h2}>Talking points</Text>
            <Bullets items={d.talking_points} />
          </>
        ) : null}
      </View>

      <RunningFooter />
    </Page>
  )
}

const FullAgendaPage = ({
  briefing,
  meetingMetaLine,
  featuredPageMap,
}: DocProps & { featuredPageMap: Map<string, number> }) => {
  const total = briefing.items.length

  return (
    <Page size="LETTER" style={styles.page}>
      <RunningHeader meetingMetaLine={meetingMetaLine} />

      <View style={styles.bodyStart}>
        <Text style={styles.h1}>Full Agenda</Text>
        <Text style={styles.h1Sub}>
          All {total} items, in order. The items in earlier sections are bolded
          with page references.
        </Text>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, styles.colNum]}>#</Text>
            <Text style={[styles.tableHeaderCell, styles.colItem]}>Item</Text>
            <Text style={[styles.tableHeaderCell, styles.colDetail]}>
              Detail
            </Text>
          </View>
          {briefing.items.map((item, i) => {
            const featuredPage = featuredPageMap.get(item.id)
            const bold = featuredPage ? styles.tableCellBold : {}
            const alt = i % 2 === 0 ? styles.tableRowAlt : {}
            return (
              <View key={item.id} style={[styles.tableRow, alt]}>
                <Text style={[styles.tableCell, styles.colNum, bold ?? {}]}>
                  {item.item_number ?? i + 1}
                </Text>
                <Text style={[styles.tableCell, styles.colItem, bold ?? {}]}>
                  {item.title}
                </Text>
                <Text style={[styles.tableCell, styles.colDetail]}>
                  {featuredPage ? `See p. ${featuredPage}` : ''}
                </Text>
              </View>
            )
          })}
        </View>
      </View>

      <RunningFooter />
    </Page>
  )
}

export const BriefingPdfDocument = ({
  briefing,
  preparedForLine,
  meetingMetaLine,
  liveBriefingUrl,
  liveBriefingQrDataUrl,
}: DocProps) => {
  const featured = briefing.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => FEATURED_TIERS.includes(item.tier))

  const featuredPageMap = new Map<string, number>()
  featured.forEach(({ item }, i) => {
    featuredPageMap.set(item.id, 4 + i)
  })

  return (
    <Document
      title={briefing.title}
      author="GoodParty.org"
      subject="Meeting Briefing"
    >
      <CoverPage
        briefing={briefing}
        preparedForLine={preparedForLine}
        meetingMetaLine={meetingMetaLine}
        liveBriefingUrl={liveBriefingUrl}
        liveBriefingQrDataUrl={liveBriefingQrDataUrl}
      />
      <TocPage
        briefing={briefing}
        meetingMetaLine={meetingMetaLine}
        featured={featured}
      />
      <ExecutiveSummaryPage
        briefing={briefing}
        meetingMetaLine={meetingMetaLine}
        featured={featured}
      />
      {featured.map(({ item }, i) => (
        <ItemPage
          key={item.id}
          briefing={briefing}
          meetingMetaLine={meetingMetaLine}
          item={item}
          position={i + 1}
          totalCount={briefing.items.length}
        />
      ))}
      <FullAgendaPage
        briefing={briefing}
        meetingMetaLine={meetingMetaLine}
        featuredPageMap={featuredPageMap}
      />
    </Document>
  )
}
