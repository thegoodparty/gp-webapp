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

const FONT_OUTFIT = 'Outfit'
const FONT_OPEN_SANS = 'Open Sans'

Font.register({
  family: FONT_OUTFIT,
  fonts: [
    { src: '/fonts/Outfit-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/Outfit-Bold.ttf', fontWeight: 700 },
  ],
})

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
  red: '#bf0020',
  starBlue: '#0027DC',
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
    alignItems: 'center',
  },
  coverWordmark: {
    fontSize: 22,
    fontFamily: FONT_OUTFIT,
    fontWeight: 700,
    color: COLOR.body,
    marginTop: 12,
  },
  coverTagline: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLOR.muted,
    marginTop: 6,
  },
  coverMiddle: {
    alignItems: 'center',
    marginTop: 96,
  },
  coverEyebrow: {
    fontSize: 30,
    fontFamily: FONT_OUTFIT,
    fontWeight: 700,
    color: COLOR.navy,
    letterSpacing: 2,
  },
  coverBody: {
    fontSize: 18,
    fontFamily: FONT_OUTFIT,
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
    fontFamily: FONT_OUTFIT,
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
    fontFamily: FONT_OUTFIT,
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
    fontFamily: FONT_OUTFIT,
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
  <Svg width={size} height={(size * 17) / 21} viewBox="0 0 21 17">
    <Path
      d="M10.5 16.0943C14.7127 14.0566 17.5108 11.7713 18.9364 9.42378C20.1435 7.43596 20.2938 5.49775 19.5359 3.90325C18.8477 2.45547 17.4495 1.42171 15.8389 1.15535C14.1199 0.871043 12.3704 1.47864 10.9834 2.98335L10.5 3.50781L10.0166 2.98335C8.6296 1.47864 6.88015 0.871043 5.16108 1.15535C3.55052 1.42171 2.15231 2.45547 1.4641 3.90325C0.706157 5.49775 0.85648 7.43596 2.06363 9.42378C3.48922 11.7713 6.28734 14.0566 10.5 16.0943Z"
      fill={COLOR.white}
      stroke={COLOR.red}
      strokeWidth={1.55798}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.0712 10.3672L8.92515 10.9561C8.80802 11.0163 8.66314 10.9723 8.60153 10.8579C8.577 10.8123 8.56853 10.7601 8.57744 10.7094L8.79643 9.46149C8.84767 9.16949 8.7486 8.87154 8.53149 8.66471L7.60382 7.78094C7.50908 7.69068 7.50717 7.54246 7.59956 7.4499C7.63633 7.41305 7.68451 7.38907 7.73664 7.38167L9.01827 7.19966C9.31848 7.15702 9.57798 6.97278 9.7122 6.70699L10.2853 5.57199C10.3439 5.45604 10.4876 5.40841 10.6062 5.46562C10.6535 5.48841 10.6918 5.52579 10.7151 5.57199L11.2883 6.70699C11.4225 6.97278 11.682 7.15702 11.9822 7.19966L13.2638 7.38167C13.3948 7.40027 13.4855 7.51906 13.4665 7.64701C13.4589 7.69794 13.4343 7.74501 13.3966 7.78094L12.469 8.66471C12.2519 8.87154 12.1528 9.16949 12.204 9.46149L12.423 10.7094C12.4454 10.8368 12.3578 10.9578 12.2273 10.9797C12.1754 10.9884 12.122 10.9801 12.0753 10.9561L10.9292 10.3672C10.6607 10.2292 10.3398 10.2292 10.0712 10.3672Z"
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
        <HeartStarMark size={48} />
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
          <Text style={styles.coverMeta}>{briefing.meetingDate}</Text>
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
      <Text style={styles.h1Sub}>{briefing.executiveSummary}</Text>

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
  const sentiment = d.constituentSentiment
  return (
    <Page size="LETTER" style={styles.page}>
      <RunningHeader meetingMetaLine={meetingMetaLine} />

      <View style={styles.bodyStart}>
        <Text style={styles.h1}>
          {position}. {item.title}
        </Text>
        {item.itemNumber ? (
          <Text style={styles.h1Sub}>
            Agenda item {item.itemNumber} of {totalCount}.
          </Text>
        ) : null}

        <Text style={styles.h2}>Overview</Text>
        <Text style={styles.para}>{d.summary}</Text>

        {d.budgetImpact ? (
          <>
            <Text style={styles.h2}>Budget impact</Text>
            <Text style={styles.para}>{d.budgetImpact.summary}</Text>
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

        {d.recentNews && d.recentNews.length > 0 ? (
          <>
            <Text style={styles.h2}>Recent news</Text>
            <Bullets
              items={d.recentNews.map((n, i) => (
                <Text key={i}>
                  {n.headline} —{' '}
                  <Text style={styles.newsOutlet}>{n.publication}</Text>
                </Text>
              ))}
            />
          </>
        ) : null}

        {d.talkingPoints && d.talkingPoints.length > 0 ? (
          <>
            <Text style={styles.h2}>Talking points</Text>
            <Bullets items={d.talkingPoints} />
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
                  {item.itemNumber ?? i + 1}
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
