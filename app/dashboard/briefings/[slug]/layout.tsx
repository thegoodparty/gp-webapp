import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getBriefingBySlug } from '@shared/briefings/server'
import {
  BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
  BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
  BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
  briefingsLandingHref,
} from '@shared/briefings/routes'
import serveAccess from '../../shared/serveAccess'
import DashboardLayout from '../../shared/DashboardLayout'
import ActiveCardScrollSpy from '../components/detail/ActiveCardScrollSpy'
import DetailHeader from '../components/detail/DetailHeader'
import DetailToc from '../components/detail/DetailToc'
import MobileBottomBar from '../components/detail/MobileBottomBar'
import ShareScope from '../components/detail/ShareScope'
import AnnotationsScope from '../components/annotations/AnnotationsScope'
import BriefingAwaitingPage from '../components/BriefingAwaitingPage'

type Props = {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

/**
 * Shared chrome for every briefing page: sticky header, sidebar TOC,
 * mobile bottom bar, and the annotations scope. Children render in the
 * main content column.
 *
 * Per-page content lives at:
 *   /dashboard/briefings/[slug]            -> Executive Summary + top issues
 *   /dashboard/briefings/[slug]/[itemId]   -> Single agenda item
 */
export default async function BriefingChromeLayout({
  params,
  children,
}: Props): Promise<React.JSX.Element> {
  await serveAccess()
  const { slug } = await params
  const briefing = await getBriefingBySlug(slug)
  if (!briefing) notFound()

  if ('status' in briefing) {
    return (
      <DashboardLayout
        pathname="/dashboard/briefings"
        showAlert={false}
        wrapperClassName="!p-0"
      >
        <BriefingAwaitingPage briefing={briefing} />
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      pathname="/dashboard/briefings"
      showAlert={false}
      wrapperClassName="!p-0"
    >
      <AnnotationsScope
        meetingDate={slug}
        initialActiveCard={{
          key: BRIEFING_EXECUTIVE_SUMMARY_DOM_ID,
          jsonPath: BRIEFING_EXECUTIVE_SUMMARY_CARD_PATH,
          titleJsonPath: BRIEFING_EXECUTIVE_SUMMARY_TITLE_PATH,
          title: 'Executive Summary',
        }}
      >
        <ActiveCardScrollSpy items={briefing.items} />
        <ShareScope briefing={briefing}>
          <div className="relative">
            {/* lg+: constrain the whole briefing area to viewport height and
              disable document-level scroll. The sidebar pane stays
              visually fixed because it doesn't scroll; only the content
              pane scrolls. Mobile keeps the original document-scroll
              model so the bottom bar / page chrome behave as before. */}
            <div className="flex min-h-full flex-col bg-muted pb-20 lg:h-svh lg:min-h-0 lg:overflow-hidden lg:pb-0">
              <DetailHeader briefing={briefing} />

              <div className="mx-auto w-full max-w-[1120px] px-4 py-6 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-hidden lg:px-8">
                <div className="mb-4">
                  <Link
                    href={briefingsLandingHref()}
                    className="inline-flex h-9 items-center gap-2 rounded-full pl-2 pr-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ArrowLeft className="size-4" aria-hidden />
                    Back to meetings
                  </Link>
                </div>

                <div className="lg:flex lg:min-h-0 lg:flex-1 lg:items-stretch lg:gap-8 lg:overflow-hidden">
                  <aside className="hidden rounded-2xl border border-border bg-card p-3 lg:block lg:w-[260px] lg:shrink-0 lg:overflow-y-auto">
                    <DetailToc briefingSlug={slug} items={briefing.items} />
                  </aside>

                  <div
                    id="briefing-detail-pane"
                    data-briefing-scroll-container
                    className="flex flex-col gap-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
                  >
                    {children}
                  </div>
                </div>
              </div>
            </div>

            <MobileBottomBar briefingSlug={slug} items={briefing.items} />
          </div>
        </ShareScope>
      </AnnotationsScope>
    </DashboardLayout>
  )
}
